import { atom, selector } from 'recoil';
import { WorkshopAddOutput, WorkshopInitialDataTypes, WorkshopUser } from '../../../definitions/WorkshopDataTypes';
import { WorkshopStep } from '@prisma/client';
import { userState } from './user';
import { WorkshopSocketInitialData } from '../../../backend/workshop/socket/resolvers/HandleWorkshopConnect';

const workshopState = atom<WorkshopSocketInitialData | null>({
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

const workshopModule = selector<WorkshopStep | null>({
   key: 'workshop/module',
   get: ({ get }) => {
      const workshop = get(workshopState);
      return workshop?.steps.find(e => e.step === workshop.currentStep) ?? null;
   },
});

const workshopStep = selector<number | null>({
   key: 'workshop/step',
   get: ({ get }) => {
      const workshop = get(workshopState);
      return workshop?.currentStep ?? null;
   },
   set: ({ get, set }, newValue) => {
      const workshop = get(workshopState);
      if (workshop) {
         set(workshopState, {
            ...workshop,
            currentStep: newValue as number,
         });
      }
   },
});

const workshopSteps = selector<WorkshopStep[] | null>({
   key: 'workshop/steps',
   get: ({get}) => {
      const workshop = get(workshopState);
      return workshop?.steps ?? null;
   }
})

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
   workshopStep,
   workshopSteps
};
