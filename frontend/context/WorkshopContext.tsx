import React, { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WorkshopSocketEvents } from '../../definitions/WorkshopSocketEvents';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
   moduleUserDataState,
   workshopModule,
   workshopState,
   workshopUsers,
} from '../state/atoms/workshop';
import { WorkshopInitialDataTypes } from '../../definitions/WorkshopDataTypes';
import { JsonObject } from 'type-fest';
import { useRouter } from 'next/router';
import { WorkshopSocketInitialData } from '../../backend/workshop/socket/resolvers/HandleWorkshopConnect';
import { WorkshopSocketModuleNext } from '../../backend/workshop/socket/resolvers/HandleModuleNext';
import { WorkshopSocketUserAdd } from '../../backend/workshop/socket/resolvers/HandleWorkshopUserAdd';
import { userState } from '../state/atoms/user';
import { WorkshopSocketUserRemove } from '../../backend/workshop/socket/resolvers/HandleWorkshopUserRemove';
import { timerState } from '../state/atoms/timer';
import { useUser } from '@auth0/nextjs-auth0';
import { WorkshopSocketModuleReview } from '../../backend/workshop/socket/resolvers/HandleModuleReview';
import { reviewModeState } from '../state/atoms/reviewMode';
import { WorkshopSocketUserFinished } from '../../backend/workshop/socket/resolvers/HandleUserFinished';

const useUpdateData = () => {
   const router = useRouter();

   const setWorkshopState = useSetRecoilState(workshopState);
   const setWorkshopModuleState = useSetRecoilState(workshopModule);
   const updateModuleUserInputState = useSetRecoilState(moduleUserDataState);
   const setUserState = useSetRecoilState(workshopUsers);
   const setTimerState = useSetRecoilState(timerState);
   const setReviewMode = useSetRecoilState(reviewModeState);

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
      if (data.currentStep && data.moduleData) {
         router.push(`/workshop/${router.query.workshop}/${data.currentStep}`);
         updateModuleUserInputState((values) => [
            ...values,
            ...data.moduleData!,
         ]);
         setWorkshopModuleState(data.template!.steps[0]);
         setReviewMode(data.isReview);
      }
   };

   const setWorkshopModuleNext = (data: WorkshopSocketModuleNext) => {
      router.push(`/workshop/${router.query.workshop}/${data.step}`);
      setWorkshopModuleState(data);
      updateModuleUserInputState([]);
      setTimerState({
         isActive: true,
         timeLeft: data.durationSeconds,
         initialTime: data.durationSeconds,
      });
      setUserState((users) => users!.map((u) => ({ ...u, isFinished: false })));
      setReviewMode(false);
   };

   const setWorkshopModuleReview = (data: WorkshopSocketModuleReview) => {
      setTimerState((value) => ({
         ...value,
         timeLeft: 0,
         isActive: false,
      }));
      setReviewMode(data.inReview);
   };

   const setUpdateModuleUserAdd = (data: WorkshopSocketUserAdd) => {
      updateModuleUserInputState((values) => [...values, data]);
   };

   const setUpdateModuleUserRemove = (data: WorkshopSocketUserRemove) => {
      updateModuleUserInputState((values) =>
         values.filter((e) => e.id !== data.id),
      );
   };

   return {
      setUserOnlineStatus,
      setWorkshopConnect,
      setWorkshopModuleNext,
      setUpdateModuleUserAdd,
      setUpdateModuleUserRemove,
      setWorkshopModuleReview,
      setUserFinished,
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
   console.log('userAuth', userAuth);
   const router = useRouter();

   const {
      setUserOnlineStatus,
      setWorkshopConnect,
      setWorkshopModuleNext,
      setUpdateModuleUserAdd,
      setUpdateModuleUserRemove,
      setWorkshopModuleReview,
      setUserFinished,
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
   connected: false,
});

export { WorkshopContextProvider, WorkshopContext };
