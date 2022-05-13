import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import {
   clearUsersFinished,
   getWorkshopStep,
   incrementWorkshopStep,
   setModuleReview,
} from '../../RedisAdapter';
import Prisma from '../../../singleton/Prisma';
import { WorkshopStep } from '@prisma/client';

type WorkshopSocketModuleNext = WorkshopStep & {};

const HandleModuleNext = async ({
   io,
   workshopId,
}: SocketServerHandlerType<null>) => {
   let currentStep = await getWorkshopStep(workshopId);
   if (currentStep) {
      currentStep++;
   }
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
   await setModuleReview(workshopId, false);
   await clearUsersFinished(workshopId);
   io.in(workshopId).emit(
      WorkshopSocketEvents.WorkshopModuleNext,
      workshopStep,
   );
};

export type { WorkshopSocketModuleNext };

export default HandleModuleNext;
