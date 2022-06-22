import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import prisma from '../../../../backend/Connections/Prisma';
import { SetIncreaseTimeModule } from '../../utils/WorkshopTimeHandling';

type WorkshopSocketIncreaseTime = {
   secondsToIncrease: number
   step: number
};

type WorkshopSocketIncreaseTimeFromServer = Omit<WorkshopSocketIncreaseTime, 'step'>;

const HandleIncreaseTime = async ({
                                     data,
                                     workshopId,
                                     io,
                                  }: SocketServerHandlerType<WorkshopSocketIncreaseTime>) => {
   if (!data) return;
   const workshop = await prisma.workshop.findUnique({
      where: {
         id: workshopId,
      },
      include: {
         steps: {
            where: {
               step: data.step,
            },
         },
      },
   });

   const stepId = workshop?.steps[0]?.id;

   if (stepId === null) {
      return;
   }
   const update = await prisma.workshop.update({
      where: {
         id: workshopId,
      },
      data: {
         steps: {
            update: {
               where: {
                  id: stepId,
               },
               data: {
                  addedSeconds: {
                     increment: data.secondsToIncrease,
                  },
               },
            },
         },
      },
   });

   await SetIncreaseTimeModule(workshopId, data.secondsToIncrease);

   const returnData: WorkshopSocketIncreaseTimeFromServer = {
      secondsToIncrease: data.secondsToIncrease,
   };

   io.in(workshopId).emit(
      WorkshopSocketEvents.WorkshopModuleTimeIncrease,
      returnData,
   );
};

export type {
   WorkshopSocketIncreaseTime,
   WorkshopSocketIncreaseTimeFromServer,
};

export default HandleIncreaseTime;
