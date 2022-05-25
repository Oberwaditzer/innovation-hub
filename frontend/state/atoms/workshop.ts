import { atom, selector } from 'recoil';
import { WorkshopAddOutput, WorkshopInitialDataTypes, WorkshopUser } from '../../../definitions/WorkshopDataTypes';
import { WorkshopStep } from '@prisma/client';
import { userState } from './user';

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

const isUserFinishedState = selector({
   key: 'workshop/user/isFinished',
   get: ({ get }) => {
      const user = get(userState);
      const users = get(workshopUsers);
      if (!users || users.length === 0) return false;
      return users.find((u) => u.id === user.userId)?.isFinished ?? false;
   },
});

const workshopModule = atom<WorkshopStep | null>({
   key: 'workshop/module',
   default: null,
});

const moduleUserDataState = atom<WorkshopAddOutput[]>({
   key: 'module/data',
   default: [],
});

const modulePreviousUserData = atom<WorkshopAddOutput[]>({
   key: 'module/previous',
   default: [],
});

export {
   workshopState,
   workshopUsers,
   workshopModule,
   sortedWorkshopUsers,
   moduleUserDataState,
   isUserFinishedState,
   modulePreviousUserData,
};
