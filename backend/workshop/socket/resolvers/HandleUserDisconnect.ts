import { SocketServerHandlerType } from '../SockerServer';
import { removeUserOnline } from '../../RedisAdapter';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';

const HandleUserDisconnect = async ({
   workshopId,
   userId,
   io,
}: SocketServerHandlerType<string>) => {
   await removeUserOnline(workshopId, userId);
   io.to(workshopId).emit(WorkshopSocketEvents.WorkshopUserOffline, userId);
   console.log('client disconnected');
};

export default HandleUserDisconnect;
