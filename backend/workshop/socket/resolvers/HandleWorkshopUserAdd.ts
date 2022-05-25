import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import { v4 as uuidv4 } from 'uuid';
import { addModuleUserData, getModuleStartTime } from '../../RedisAdapter';
import { PrismaClient, WorkshopPrivacyLevel } from '@prisma/client';
import { WorkshopAddInput, WorkshopAddOutput } from '../../../../definitions/WorkshopDataTypes';


const HandleWorkshopUserAdd = async ({
                                        socket,
                                        workshopId,
                                        userId,
                                        data,
                                        io,
                                     }: SocketServerHandlerType<WorkshopAddInput>) => {
   if (!data) return;
   const workshop = await new PrismaClient().workshop.findUnique({
      where: {
         id: workshopId,
      },
   });
   const millisecondsPassed = new Date().getTime() - (await getModuleStartTime(workshopId));
   const privacyLevel: WorkshopPrivacyLevel =
      workshop?.privacyLevel || 'PRIVATE';
   let returnData: WorkshopAddOutput = {
      userId: userId,
      id: uuidv4(),
      data: data.data,
      createTime: new Date(),
      type: data.type,
      relevantForNextModule: data.relevantForNextModule,
      timeInWorkshop: millisecondsPassed,
   };
   console.log(returnData);
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

export default HandleWorkshopUserAdd;
