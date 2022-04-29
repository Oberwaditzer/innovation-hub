import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const hasUserAccessToWorkshop = async (workshopId: string, userId: string) => {
   return true;
   const result = await prisma.usersOnWorkshops.findFirst({
      where: {
         workshopId: workshopId,
         userId: userId,
      },
   });
   return result;
};

export { hasUserAccessToWorkshop };
