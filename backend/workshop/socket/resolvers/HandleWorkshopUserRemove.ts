import * as socketio from 'socket.io';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import { JsonObject } from 'type-fest';
import { v4 as uuidv4 } from 'uuid';
import { addModuleUserData, removeModuleUserData } from '../../RedisAdapter';

type WorkshopSocketUserRemove = {
   id: string;
};

const HandleWorkshopUserRemove = async ({
   socket,
   workshopId,
   userId,
   data,
   io,
}: SocketServerHandlerType<WorkshopSocketUserRemove>) => {
   await removeModuleUserData(workshopId, data!.id);
   io.to(workshopId).emit(WorkshopSocketEvents.WorkshopUserRemove, data);
};

export type { WorkshopSocketUserRemove };

export default HandleWorkshopUserRemove;
