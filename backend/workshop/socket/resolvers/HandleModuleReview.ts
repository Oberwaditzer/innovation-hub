import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import { getModuleUserData, setModuleReview } from '../../RedisAdapter';
import { PrismaClient } from '@prisma/client';
import {WorkshopAddOutput} from "../../../../definitions/WorkshopDataTypes";

type WorkshopSocketModuleReview = {
   inReview: boolean;
};

type WorkshopSocketModuleReviewFromServer = WorkshopSocketModuleReview & {
   data: WorkshopAddOutput[];
};

const HandleModuleReview = async ({
   data,
   workshopId,
   io,
}: SocketServerHandlerType<WorkshopSocketModuleReview>) => {
   if (!data) return;
   const userData = await getModuleUserData(workshopId);
   await setModuleReview(workshopId, data!.inReview);
   const workshop = await new PrismaClient().workshop.findUnique({
      where: {
         id: workshopId,
      },
   });
   const returnData = {
      ...data,
      data: userData?.map((data) => ({
         ...data,
         userId: workshop!.privacyLevel === 'FULL_VISIBLE' ? data.userId : null,
      })),
   };
   io.in(workshopId).emit(
      WorkshopSocketEvents.WorkshopModuleReview,
      returnData,
   );
};

export type {
   WorkshopSocketModuleReview,
   WorkshopSocketModuleReviewFromServer,
};

export default HandleModuleReview;
