import * as socketio from 'socket.io';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import { JsonObject } from 'type-fest';

type WorkshopSocketUserAdd = {
   userId: string;
   id: string;
   data: JsonObject;
};

const HandleWorkshopUserAdd = async ({
   socket,
   workshopId,
   data,
}: SocketServerHandlerType<any>) => {
   socket.to(workshopId).emit(WorkshopSocketEvents.WorkshopUserAdd, data);
};

export type { WorkshopSocketUserAdd };

export default HandleWorkshopUserAdd;
