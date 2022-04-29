import { PrismaClient } from '@prisma/client';

class Prisma {
   private static instance: PrismaClient;

   constructor() {
      if (!Prisma.instance) {
         Prisma.instance = new PrismaClient();
      }
   }

   static getInstance() {
      return Prisma.instance;
   }
}

export default Prisma;
