import * as socketio from 'socket.io';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import { JsonObject } from 'type-fest';
import { v4 as uuidv4 } from 'uuid';
import { addModuleUserData } from '../../RedisAdapter';
import { PrismaClient, WorkshopPrivacyLevel } from '@prisma/client';

type WorkshopSocketUserAdd = {
   userId: string | null;
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
   const workshop = await new PrismaClient().workshop.findUnique({
      where: {
         id: workshopId,
      },
   });
   const privacyLevel: WorkshopPrivacyLevel =
      workshop?.privacyLevel || 'PRIVATE';
   let returnData: WorkshopSocketUserAdd = {
      userId: userId,
      id: uuidv4(),
      data: data.data,
   };
   await addModuleUserData(workshopId, returnData);
   if (privacyLevel === 'FULL_VISIBLE') {
      io.to(workshopId).emit(WorkshopSocketEvents.WorkshopUserAdd, returnData);
   } else if (privacyLevel === 'VISIBLE_WITHOUT_USER_INFORMATION') {
      socket.emit(WorkshopSocketEvents.WorkshopUserAdd, returnData);
      returnData.userId = null;
      socket
         .to(workshopId)
         .emit(WorkshopSocketEvents.WorkshopUserAdd, returnData);
   } else {
      socket.emit(WorkshopSocketEvents.WorkshopUserAdd, returnData);
   }
};

export type { WorkshopSocketUserAdd };

export default HandleWorkshopUserAdd;
