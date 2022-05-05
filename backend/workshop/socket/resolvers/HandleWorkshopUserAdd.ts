import * as socketio from 'socket.io';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import { JsonObject } from 'type-fest';
import { v4 as uuidv4 } from 'uuid';
import { addModuleUserData } from '../../RedisAdapter';

type WorkshopSocketUserAdd = {
   userId: string;
   id: string;
   data: JsonObject;
};

const HandleWorkshopUserAdd = async ({
   socket,
   workshopId,
   userId,
   data,
   io,
}: SocketServerHandlerType<any>) => {
   const returnData: WorkshopSocketUserAdd = {
      userId: userId,
      id: uuidv4(),
      data: data.data,
   };
   await addModuleUserData(workshopId, returnData);
   io.to(workshopId).emit(WorkshopSocketEvents.WorkshopUserAdd, returnData);
};

export type { WorkshopSocketUserAdd };

export default HandleWorkshopUserAdd;
