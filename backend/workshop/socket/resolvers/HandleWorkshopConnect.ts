import * as socketio from 'socket.io';
import {
   getModuleReview,
   getModuleUserData,
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

type WorkshopSocketInitialData = {
   name: string;
   users: WorkshopUser[];
   template: any;
   moduleData?: WorkshopSocketUserAdd[];
   currentStep?: number;
   isReview: boolean;
};

const HandleWorkshopConnect = async ({
   socket,
   workshopId,
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
   const initialData: WorkshopSocketInitialData = {
      users: workshop!.users.map((user) => ({
         ...user.user,
         isOnline: usersOnline.includes(user.user.id),
         isFacilitator: false,
      })),
      name: workshop!.title,
      template: workshop!.template,
      moduleData: currentStep
         ? (await getModuleUserData(workshopId))!
         : undefined,
      currentStep: currentStep || undefined,
      isReview: await getModuleReview(workshopId),
   };
   socket.emit(WorkshopSocketEvents.WorkshopConnect, initialData);
};

export type { WorkshopSocketInitialData };

export default HandleWorkshopConnect;
