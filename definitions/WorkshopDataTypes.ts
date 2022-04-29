import { User } from '@prisma/client';

type WorkshopInitialDataTypes = {
   name: string;
};

type WorkshopInitialDataServerTypes = WorkshopInitialDataTypes & {
   users: WorkshopUser[];
};

type WorkshopUser = User & {
   isFacilitator: boolean;
   isOnline: boolean;
};

export type {
   WorkshopInitialDataTypes,
   WorkshopInitialDataServerTypes,
   WorkshopUser,
};
