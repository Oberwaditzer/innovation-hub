import * as socketio from 'socket.io';
import {
   addUserFinished,
   getModuleReview,
   getModuleUserData,
   getUsersOnline,
   getWorkshopStep,
   incrementWorkshopStep,
   removeUserFinished,
} from '../../RedisAdapter';
import {
   WorkshopInitialDataServerTypes,
   WorkshopUser,
} from '../../../../definitions/WorkshopDataTypes';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import Prisma from '../../../singleton/Prisma';
import { SocketServerHandlerType } from '../SockerServer';
import { JsonObject } from 'type-fest';
import { WorkshopSocketUserAdd } from './HandleWorkshopUserAdd';
import { WorkshopSocketModuleNext } from './HandleModuleNext';

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
