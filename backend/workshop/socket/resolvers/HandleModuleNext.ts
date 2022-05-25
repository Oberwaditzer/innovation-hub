import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import {
   clearModuleUserData,
   clearUsersFinished,
   getModuleUserData,
   getWorkshopStep,
   incrementWorkshopStep,
   setModuleReview,
   setModuleStartTime, setWorkshopInResults,
} from '../../RedisAdapter';
import { PrismaClient, WorkshopStep, WorkshopStepData } from '@prisma/client';
import { WorkshopAddOutput } from '../../../../definitions/WorkshopDataTypes';
import { JsonObject } from 'type-fest';

type WorkshopSocketModuleNext = {
   step: WorkshopStep,
   previousData: WorkshopAddOutput[];
   isResults: boolean
};

const HandleModuleNext = async ({
                                   io,
                                   workshopId,
                                }: SocketServerHandlerType<null>) => {
   const prisma = new PrismaClient();
   let currentStep = await getWorkshopStep(workshopId);
   if (currentStep !== null) {
      currentStep++;
   } else {
      currentStep = 1;
   }
   const workshop = await prisma.workshop.findUnique({
      where: {
         id: workshopId,
      },
      include: {
         template: {
            include: {
               steps: {
                  where: {
                     step: currentStep,
                  },
               },
            },
         },
         steps: true,
      },
   });
   if (!workshop) return;

   let stepData: WorkshopAddOutput[] = [];

   // ToDo Set the correct Step Information
   if (currentStep !== 1) {
      const userData = await getModuleUserData(workshopId);

      const test = await prisma.workshop.update({
         where: {
            id: workshopId,
         },
         include: {
            steps: {
               include: {
                  data: {
                     where: {
                        relevantForNextModule: true,
                     },
                  },
               },
            },
         },
         data: {
            steps: {
               update: {
                  where: {
                     id: workshop!.steps!.find(e => e.step === currentStep! - 1)!.id!,
                  },
                  data: {
                     data: {
                        createMany: {
                           data: userData!.map(data => ({
                              data: data.data,
                              createTime: data.createTime,
                              timeInWorkshop: data.timeInWorkshop,
                              userId: data.userId!,
                              relevantForNextModule: data.relevantForNextModule,
                              type: data.type,
                           })),
                           skipDuplicates: true,
                        },
                     },
                  },
               },
            },
         },
      });
      stepData = test.steps.find(e => e.step === currentStep! - 1)!.data.map(e => ({
         ...e,
         data: e.data as JsonObject,
      }));
   }

   await incrementWorkshopStep(workshopId);
   await setModuleReview(workshopId, false);
   await clearUsersFinished(workshopId);
   await setModuleStartTime(workshopId, new Date().getTime());
   await clearModuleUserData(workshopId);

   currentStep = await getWorkshopStep(workshopId);

   const isLast = workshop.steps.find(e => e.step === currentStep) == null;

   if(isLast) {
      await setWorkshopInResults(workshopId, true);
   }

   const sendData: WorkshopSocketModuleNext = {
      step: workshop!.steps!.find(e => e.step === currentStep)!,
      previousData: stepData,
      isResults: isLast,
   };

   io.in(workshopId).emit(
      WorkshopSocketEvents.WorkshopModuleNext,
      sendData,
   );
};

export type { WorkshopSocketModuleNext };

export default HandleModuleNext;
