import * as socketio from 'socket.io';
import { WorkshopSocketEvents } from '../../../definitions/WorkshopSocketEvents';
import { addUserOnline } from '../RedisAdapter';
import HandleWorkshopConnect from './resolvers/HandleWorkshopConnect';
import HandleModuleNext from './resolvers/HandleModuleNext';
import HandleWorkshopUserAdd from './resolvers/HandleWorkshopUserAdd';
import HandleUserDisconnect from './resolvers/HandleUserDisconnect';
import { hasUserAccessToWorkshop } from '../UserAccess';
import { ExtendedError } from 'socket.io/dist/namespace';
import HandleWorkshopUserRemove from './resolvers/HandleWorkshopUserRemove';
import HandleModuleReview from './resolvers/HandleModuleReview';

const OnConnection = async (socket: socketio.Socket, io: socketio.Server) => {
   const workshopId = socket.handshake.auth.workshopId;
   const userId = socket.handshake.auth.userId;

   socket.join(workshopId);
   console.log(`client connected to room ${workshopId}`);

   socket.to(workshopId).emit(WorkshopSocketEvents.WorkshopUserOnline, userId);

   socket.on(WorkshopSocketEvents.WorkshopConnect, async (data: null) =>
      HandleWorkshopConnect({ socket, workshopId, userId, io, data }),
   );

   socket.on(WorkshopSocketEvents.WorkshopModuleNext, async (data) =>
      HandleModuleNext({ socket, workshopId, userId, io, data }),
   );

   socket.on(WorkshopSocketEvents.WorkshopModuleReview, async (data) =>
      HandleModuleReview({ socket, workshopId, userId, io, data }),
   );

   socket.on(WorkshopSocketEvents.WorkshopUserAdd, async (data) =>
      HandleWorkshopUserAdd({ socket, workshopId, userId, io, data }),
   );

   socket.on(WorkshopSocketEvents.WorkshopUserRemove, async (data) =>
      HandleWorkshopUserRemove({ socket, workshopId, userId, io, data }),
   );

   socket.on('disconnect', async (data) =>
      HandleUserDisconnect({ socket, workshopId, userId, io, data }),
   );

   await addUserOnline(workshopId, userId);
};

const HandleAuthentication = async (
   socket: socketio.Socket,
   next: (err?: ExtendedError | undefined) => void,
) => {
   const userId = socket.handshake.auth.userId;
   const workshopId = socket.handshake.auth.workshopId;
   if (!(await hasUserAccessToWorkshop(workshopId, userId))) {
      next(new Error('not authorized'));
   }
   next();
};

type SocketServerHandlerType<T> = {
   socket: socketio.Socket;
   workshopId: string;
   userId: string;
   io: socketio.Server;
   data: T | null;
};

export { OnConnection, HandleAuthentication };
export type { SocketServerHandlerType };
