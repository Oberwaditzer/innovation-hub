import { SocketServerHandlerType } from '../SockerServer';
import { clearWorkshop, getUsersOnline, removeUserOnline } from '../../RedisAdapter';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';

const HandleUserDisconnect = async ({
                                       workshopId,
                                       userId,
                                       io,
                                    }: SocketServerHandlerType<string>) => {
   await removeUserOnline(workshopId, userId);
   io.to(workshopId).emit(WorkshopSocketEvents.WorkshopUserOffline, userId);
   const usersOnline = await getUsersOnline(workshopId);
   if (usersOnline.length === 0) {
      await clearWorkshop(workshopId);
      const workshop = await prisma.workshop.findUnique({
         where: {
            id: workshopId,
         },
      });
      if (!workshop) {
         return;
      }
      if (workshop.status !== 'FINISHED') {
         await prisma.workshop.update({
            where: {
               id: workshopId,
            },
            data: {
               status: 'STOPPED',
            },
         });
      }
   }
};

export default HandleUserDisconnect;
