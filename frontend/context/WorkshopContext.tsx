import React, { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WorkshopSocketEvents } from '../../definitions/WorkshopSocketEvents';
import { useSetRecoilState } from 'recoil';
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

const useUpdateData = () => {
   const router = useRouter();

   const setWorkshopState = useSetRecoilState(workshopState);
   const setWorkshopModuleState = useSetRecoilState(workshopModule);
   const updateModuleUserInputState = useSetRecoilState(moduleUserDataState);
   const setUserOnlineState = useSetRecoilState(workshopUsers);

   const setUserOnlineStatus = (user: string, isOnline: boolean) => {
      setUserOnlineState((users) =>
         users!.map((u) => ({
            ...u,
            isOnline: user === u.id ? isOnline : u.isOnline,
         })),
      );
   };

   const setWorkshopConnect = (data: WorkshopSocketInitialData) => {
      setWorkshopState(data);
      setUserOnlineState(data.users);
   };

   const setWorkshopModuleNext = (data: WorkshopSocketModuleNext) => {
      let index = 1;
      if (router.query.index) {
         index = parseInt(router.query.index as string) + 1;
      }
      router.push(`/workshop/${router.query.workshop}/${index}`);
      setWorkshopModuleState(data);
      updateModuleUserInputState([]);
   };

   const setUpdateModuleUserInput = (data: WorkshopSocketUserAdd) => {
      updateModuleUserInputState((values) => [...values, data]);
   };

   return {
      setUserOnlineStatus,
      setWorkshopConnect,
      setWorkshopModuleNext,
      setUpdateModuleUserInput,
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

   const {
      setUserOnlineStatus,
      setWorkshopConnect,
      setWorkshopModuleNext,
      setUpdateModuleUserInput,
   } = useUpdateData();

   const router = useRouter();

   // Needs to be cleaned after router changes
   useEffect(() => {
      if (!connected) return;
      socket.current.on(
         WorkshopSocketEvents.WorkshopModuleNext,
         setWorkshopModuleNext,
      );
      return () => {
         socket.current?.off(WorkshopSocketEvents.WorkshopModuleNext);
      };
   }, [connected, router.asPath, setWorkshopModuleNext]);

   const connect = () => {
      if (socket.current.connected) return;

      console.info('Trying to connect to the server...');

      socket.current.auth = {
         userId: 'cl2rqtu4a0025y3h5yoqydwss',
         workshopId: 'ckzd563vz00023e6cyh70f1tt',
      };
      socket.current?.connect();

      socket.current.on('connect', () => {
         console.info('Succesfully connected to the server');
         socket.current.emit(WorkshopSocketEvents.WorkshopConnect, true);
         setConnected(true);
      });

      socket.current.on(WorkshopSocketEvents.WorkshopUserOnline, (data) =>
         setUserOnlineStatus(data, true),
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
         setUpdateModuleUserInput,
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
