import * as socketio from 'socket.io';
import { getUsersOnline } from '../../RedisAdapter';
import {
   WorkshopInitialDataServerTypes,
   WorkshopUser,
} from '../../../../definitions/WorkshopDataTypes';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import Prisma from '../../../singleton/Prisma';
import { SocketServerHandlerType } from '../SockerServer';

type WorkshopSocketInitialData = {
   name: string;
   users: WorkshopUser[];
   template: any;
};

const HandleWorkshopConnect = async ({
   socket,
   workshopId,
}: SocketServerHandlerType<null>) => {
   const usersOnline = await getUsersOnline(workshopId);
   const workshop = await Prisma.getInstance().workshop.findUnique({
      where: {
         id: workshopId,
      },
      include: {
         users: {
            include: {
               user: true,
            },
         },
         template: {
            include: {
               steps: {
                  orderBy: {
                     step: 'asc',
                  },
                  take: 1,
               },
            },
         },
      },
   });
   const initialData: WorkshopSocketInitialData = {
      users: workshop!.users.map((user) => ({
         ...user.user,
         isOnline: usersOnline.includes(user.user.id),
         isFacilitator: false,
      })),
      name: workshop!.title,
      template: workshop!.template,
   };
   console.log(initialData);
   console.log(usersOnline);
   socket.emit(WorkshopSocketEvents.WorkshopConnect, initialData);
};

export type { WorkshopSocketInitialData };

export default HandleWorkshopConnect;
