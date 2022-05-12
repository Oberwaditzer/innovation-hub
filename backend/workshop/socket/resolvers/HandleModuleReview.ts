import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import { setModuleReview } from '../../RedisAdapter';

type WorkshopSocketModuleReview = {
   inReview: boolean;
};

const HandleModuleReview = async ({
   data,
   workshopId,
   io,
}: SocketServerHandlerType<WorkshopSocketModuleReview>) => {
   if (!data) return;
   await setModuleReview(workshopId, data!.inReview);
   io.in(workshopId).emit(WorkshopSocketEvents.WorkshopModuleReview, data);
};

export type { WorkshopSocketModuleReview };

export default HandleModuleReview;
