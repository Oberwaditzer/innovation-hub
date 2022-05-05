import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import { getWorkshopStep, incrementWorkshopStep } from '../../RedisAdapter';
import Prisma from '../../../singleton/Prisma';
import { WorkshopStep } from '@prisma/client';

type WorkshopSocketModuleNext = WorkshopStep & {};

const HandleModuleNext = async ({
   socket,
   workshopId,
}: SocketServerHandlerType<null>) => {
   const currentStep = await getWorkshopStep(workshopId);
   const workshop = await Prisma.getInstance().workshop.findUnique({
      where: {
         id: workshopId,
      },
      include: {
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
   const workshopStep = workshop!.template!.steps[0];
   await incrementWorkshopStep(workshopId);
   socket
      .in(workshopId)
      .emit(WorkshopSocketEvents.WorkshopModuleNext, workshopStep);
   socket.emit(WorkshopSocketEvents.WorkshopModuleNext, workshopStep);
};

export type { WorkshopSocketModuleNext };

export default HandleModuleNext;
