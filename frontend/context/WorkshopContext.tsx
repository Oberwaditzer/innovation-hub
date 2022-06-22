import React, { useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WorkshopSocketEvents } from '../../definitions/WorkshopSocketEvents';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
   modulePreviousUserData,
   moduleUserDataState,
   workshopModule,
   workshopState, workshopStep,
   workshopUsers,
} from '../state/atoms/workshop';
import { JsonObject } from 'type-fest';
import { useRouter } from 'next/router';
import { WorkshopSocketInitialData } from '../../backend/workshop/socket/resolvers/HandleWorkshopConnect';
import { WorkshopSocketModuleNext } from '../../backend/workshop/socket/resolvers/HandleModuleNext';
import { userState } from '../state/atoms/user';
import { timerState } from '../state/atoms/timer';
import { useUser } from '@auth0/nextjs-auth0';
import { WorkshopSocketModuleReviewFromServer } from '../../backend/workshop/socket/resolvers/HandleModuleReview';
import { reviewModeState } from '../state/atoms/reviewMode';
import { WorkshopSocketUserFinished } from '../../backend/workshop/socket/resolvers/HandleUserFinished';
import { WorkshopAddOutput, WorkshopRemoveInput } from '../../definitions/WorkshopDataTypes';
import { resultsModeState } from '../state/atoms/inResults';
import { WorkshopSocketIncreaseTimeFromServer } from '../../backend/workshop/socket/resolvers/HandleIncreaseTime';

const useUpdateData = () => {
   const router = useRouter();

   const { user: userAuth } = useUser();

   const setWorkshopState = useSetRecoilState(workshopState);
   const updateModuleUserInputState = useSetRecoilState(moduleUserDataState);
   const setModulePreviousData = useSetRecoilState(modulePreviousUserData);
   const setUserState = useSetRecoilState(workshopUsers);
   const setPersonalUserState = useSetRecoilState(userState);
   const setTimerState = useSetRecoilState(timerState);
   const setReviewMode = useSetRecoilState(reviewModeState);
   const setResultsMode = useSetRecoilState(resultsModeState);
   const setWorkshopStepState = useSetRecoilState(workshopStep);

   const setUserOnlineStatus = (user: string, isOnline: boolean) => {
      setUserState((users) =>
         users!.map((u) => ({
            ...u,
            isOnline: user === u.id ? isOnline : u.isOnline,
         })),
      );
   };

   const setUserFinished = (data: WorkshopSocketUserFinished) => {
      setUserState((users) =>
         users!.map((u) => ({
            ...u,
            isFinished: data.userId === u.id ? data.isFinished : u.isFinished,
         })),
      );
   };

   const setWorkshopConnect = (data: WorkshopSocketInitialData) => {
      setWorkshopState(data);
      setUserState(data.users);
      setPersonalUserState({
         userId: (userAuth?.db_id as string) ?? '',
         isFacilitator:
            data.users.find((user) => user.id === userAuth?.db_id)
               ?.isFacilitator ?? false,
      });
      if (data.currentStep && data.moduleData) {
         if (data.isResults) {
            setResultsMode(true);
            router.push(`/workshop/${router.query.workshop}/results`);
         } else {
            setResultsMode(false);
            router.push(`/workshop/${router.query.workshop}/${data.currentStep}`);
         }
         updateModuleUserInputState((values) => [
            ...values,
            ...data.moduleData!.userInput,
         ]);
         setReviewMode(data.isReview);
         setModulePreviousData(data.moduleData.previousData);
         setTimerState({
            isActive: !data.isReview,
            timeLeft: data.timeLeft,
            initialTime: data.timeLeft,
         });
      }
   };

   const setWorkshopModuleNext = (data: WorkshopSocketModuleNext) => {
      if (data.isResults) {
         router.push(`/workshop/${router.query.workshop}/results`);
         setResultsMode(true);
      } else {
         router.push(`/workshop/${router.query.workshop}/${data.step.step}`);
         setTimerState({
            isActive: true,
            timeLeft: data.step.durationSeconds,
            initialTime: data.step.durationSeconds,
         });
         setReviewMode(false);
         setWorkshopStepState(data.step.step);
      }
      updateModuleUserInputState([]);
      setModulePreviousData(data.previousData);
      setReviewMode(false);
      setUserState((users) => users!.map((u) => ({ ...u, isFinished: false })));
   };

   const setWorkshopModuleReview = (
      data: WorkshopSocketModuleReviewFromServer,
   ) => {
      setTimerState((value) => ({
         ...value,
         timeLeft: 0,
         isActive: false,
      }));
      updateModuleUserInputState(data.data);
      setReviewMode(data.inReview);
   };

   const setUpdateModuleUserAdd = (data: WorkshopAddOutput) => {
      updateModuleUserInputState((values) => [...values, data]);
   };

   const setUpdateModuleUserRemove = (data: WorkshopRemoveInput) => {
      updateModuleUserInputState((values) =>
         values.filter((e) => e.id !== data.id),
      );
   };

   const setUpdateModuleUserChange = (data: WorkshopAddOutput) => {
      updateModuleUserInputState((values) =>
         values.map((e) => {
            if (e.id === data.id) {
               return data;
            }
            return e;
         }),
      );
   };

   const setIncreaseTime = (data: WorkshopSocketIncreaseTimeFromServer) => {
      setTimerState((value) => ({
         ...value,
         timeLeft: data.secondsToIncrease,
         isActive: true,
      }));
   };

   return {
      setUserOnlineStatus,
      setWorkshopConnect,
      setWorkshopModuleNext,
      setUpdateModuleUserAdd,
      setUpdateModuleUserRemove,
      setWorkshopModuleReview,
      setUserFinished,
      setUpdateModuleUserChange,
      setIncreaseTime,
   };
};

type WorkshopContextProviderProps = {
   children: React.ReactNode;
};

const WorkshopContextProvider = ({
                                    children,
                                 }: WorkshopContextProviderProps) => {
   const socket = useRef<Socket>(io({ autoConnect: false }));
   const [connected, setConnected] = useState(false);
   const user = useRecoilValue(userState);
   const { user: userAuth } = useUser();
   const router = useRouter();

   const {
      setUserOnlineStatus,
      setWorkshopConnect,
      setWorkshopModuleNext,
      setUpdateModuleUserAdd,
      setUpdateModuleUserRemove,
      setWorkshopModuleReview,
      setUserFinished,
      setUpdateModuleUserChange,
      setIncreaseTime,
   } = useUpdateData();

   const connect = () => {
      if (socket.current.connected) return;

      console.info('Trying to connect to the server...');

      socket.current.auth = {
         userId: userAuth!.db_id,
         workshopId: router.query.workshop,
      };
      socket.current?.connect();

      socket.current.on('connect', () => {
         console.info('Succesfully connected to the server');
         socket.current.emit(WorkshopSocketEvents.WorkshopConnect, true);
         setConnected(true);
      });

      socket.current.on(
         WorkshopSocketEvents.WorkshopModuleNext,
         setWorkshopModuleNext,
      );

      socket.current.on(
         WorkshopSocketEvents.WorkshopModuleReview,
         setWorkshopModuleReview,
      );

      socket.current.on(WorkshopSocketEvents.WorkshopUserOnline, (data) =>
         setUserOnlineStatus(data, true),
      );

      socket.current.on(WorkshopSocketEvents.WorkshopUserFinished, (data) =>
         setUserFinished(data),
      );

      socket.current.on(WorkshopSocketEvents.WorkshopUserOffline, (data) =>
         setUserOnlineStatus(data, false),
      );

      socket.current.on(
         WorkshopSocketEvents.WorkshopConnect,
         setWorkshopConnect,
      );

      socket.current.on(
         WorkshopSocketEvents.WorkshopUserAdd,
         setUpdateModuleUserAdd,
      );

      socket.current.on(
         WorkshopSocketEvents.WorkshopUserRemove,
         setUpdateModuleUserRemove,
      );

      socket.current.on(
         WorkshopSocketEvents.WorkshopUserChange,
         setUpdateModuleUserChange,
      );

      socket.current.on(
         WorkshopSocketEvents.WorkshopModuleTimeIncrease,
         setIncreaseTime,
      );
   };

   const disconnect = () => {
      socket.current?.disconnect();
      router.push('/');
   };

   const sendData = (type: WorkshopSocketEvents, data: JsonObject) => {
      if (!socket.current?.connected) {
         return;
      }
      socket.current.emit(type, data);
   };

   return (
      <WorkshopContext.Provider
         value={{
            socket: socket.current,
            connect: connect,
            connected: connected,
            sendData: sendData,
            disconnect: disconnect,
         }}
      >
         {children}
      </WorkshopContext.Provider>
   );
};

type WorkshopContextProps = {
   socket: null | Socket;
   connect: () => void;
   connected: boolean;
   sendData: (type: WorkshopSocketEvents, data: JsonObject) => void;
   disconnect: () => void;
};

const WorkshopContext = React.createContext<WorkshopContextProps>({
   socket: null,
   connect: () => {
      console.warn(
         'WorkshopContext.connect was called, but was not found in Context',
      );
   },
   sendData: (data) => {
      console.warn(
         'WorkshopContext.sendData was called, but was not found in Context',
      );
   },
   disconnect: () => {
      console.warn('WorkshopContext.disconnect was called, but was not found in Context');
   },
   connected: false,
});

export { WorkshopContextProvider, WorkshopContext };
