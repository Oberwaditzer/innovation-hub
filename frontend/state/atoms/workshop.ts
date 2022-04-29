import { atom, selector } from 'recoil';
import {
   WorkshopInitialDataTypes,
   WorkshopUser,
} from '../../../definitions/WorkshopDataTypes';
import { WorkshopSocketUserAdd } from '../../../backend/workshop/socket/resolvers/HandleWorkshopUserAdd';
import { WorkshopStep } from '@prisma/client';

const workshopState = atom<WorkshopInitialDataTypes | null>({
   key: 'workshop',
   default: null,
});

const workshopUsers = atom<WorkshopUser[] | null>({
   key: 'workshop/users',
   default: null,
});

const sortedWorkshopUsers = selector({
   key: 'workshop/users/sorted',
   get: ({ get }) => {
      const users = get(workshopUsers);
      if (!users || users.length === 0) {
         return null;
      }
      return [...users].sort((a, b) => {
         if (a.isOnline && !b.isOnline) return -1;
         if (!a.isOnline && b.isOnline) return 1;
         return 0;
      });
   },
});

const workshopModule = atom<WorkshopStep | null>({
   key: 'workshop/module',
   default: null,
});

const moduleUserDataState = atom<WorkshopSocketUserAdd[]>({
   key: 'module/data',
   default: [],
});

export {
   workshopState,
   workshopUsers,
   workshopModule,
   sortedWorkshopUsers,
   moduleUserDataState,
};
