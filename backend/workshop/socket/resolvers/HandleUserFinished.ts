import {addUserFinished, removeUserFinished,} from '../../RedisAdapter';
import {WorkshopSocketEvents} from '../../../../definitions/WorkshopSocketEvents';
import {SocketServerHandlerType} from '../SockerServer';

type WorkshopSocketUserFinished = {
   userId: string;
   isFinished: boolean;
};

const HandleUserFinished = async ({
   socket,
   workshopId,
   data,
   io,
}: SocketServerHandlerType<WorkshopSocketUserFinished>) => {
   if (!data) return;
   if (data.isFinished) {
      await addUserFinished(workshopId, data.userId);
   } else {
      await removeUserFinished(workshopId, data.userId);
   }

   io.to(workshopId).emit(WorkshopSocketEvents.WorkshopUserFinished, data);
};

export type { WorkshopSocketUserFinished };

export default HandleUserFinished;
