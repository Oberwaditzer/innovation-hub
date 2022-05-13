import * as socketio from 'socket.io';
import {
   getModuleReview,
   getModuleUserData,
   getUsersFinished,
   getUsersOnline,
   getWorkshopStep,
   incrementWorkshopStep,
} from '../../RedisAdapter';
import {
   WorkshopInitialDataServerTypes,
   WorkshopUser,
} from '../../../../definitions/WorkshopDataTypes';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import Prisma from '../../../singleton/Prisma';
import { SocketServerHandlerType } from '../SockerServer';
import { JsonObject } from 'type-fest';
import { WorkshopSocketUserAdd } from './HandleWorkshopUserAdd';
import { WorkshopSocketModuleNext } from './HandleModuleNext';
import { Workshop, WorkshopPrivacyLevel } from '@prisma/client';

type WorkshopSocketInitialData = {
   name: string;
   users: WorkshopUser[];
   template: any;
   moduleData?: WorkshopSocketUserAdd[];
   currentStep?: number;
   isReview: boolean;
   privacyLevel: WorkshopPrivacyLevel;
};

const HandleWorkshopConnect = async ({
   socket,
   workshopId,
   userId,
}: SocketServerHandlerType<null>) => {
   const usersOnline = await getUsersOnline(workshopId);
   let currentStep = await getWorkshopStep(workshopId);
   const workshop = await Prisma.getInstance().workshop.findUnique({
      where: {
         id: workshopId,
      },
      include: {
         users: {
            include: {
               user: true,
            },
         },
         template: {
            include: {
               steps: {
                  where: {
                     step: currentStep ?? 1,
                  },
               },
            },
         },
      },
   });

   const isReview = await getModuleReview(workshopId);
   const moduleUserData = (await getModuleUserData(workshopId))!;
   let moduleData;

   if (isReview) {
      moduleData = moduleUserData.map((data) => ({
         ...data,
         userId: workshop!.privacyLevel === 'FULL_VISIBLE' ? data.userId : null,
      }));
   } else {
      moduleData = getModuleDataBasedOnPrivacyLevel(
         moduleUserData,
         workshop!,
         userId,
      );
   }

   const finishedUsers = await getUsersFinished(workshopId);

   const initialData: WorkshopSocketInitialData = {
      users: workshop!.users.map((user) => ({
         ...user.user,
         isOnline: usersOnline.includes(user.user.id),
         isFacilitator: user.admin,
         isFinished: finishedUsers.includes(user.userId) ?? false,
      })),
      name: workshop!.title,
      template: workshop!.template,
      moduleData: currentStep ? moduleData : undefined,
      currentStep: currentStep || undefined,
      isReview: isReview,
      privacyLevel: workshop!.privacyLevel,
   };
   socket.emit(WorkshopSocketEvents.WorkshopConnect, initialData);
};

const getModuleDataBasedOnPrivacyLevel = (
   data: WorkshopSocketUserAdd[],
   workshop: Workshop,
   userId: string,
) =>
   data
      .filter((data) => {
         if (
            workshop!.privacyLevel === 'FULL_VISIBLE' ||
            workshop!.privacyLevel === 'VISIBLE_WITHOUT_USER_INFORMATION'
         )
            return true;
         if (data.userId === userId) return true;
         return false;
      })
      .map((data) => ({
         ...data,
         userId:
            workshop!.privacyLevel === 'VISIBLE_WITHOUT_USER_INFORMATION' &&
            data.userId !== userId
               ? null
               : data.userId,
      }));

export type { WorkshopSocketInitialData };

export default HandleWorkshopConnect;
