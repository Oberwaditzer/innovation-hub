import React, {useRef, useState} from 'react';
import {io, Socket} from "socket.io-client";
import {WorkshopSocketTypes} from "../../definitions/WorkshopSocketTypes";

type WorkshopContextProviderProps = {
    children: React.ReactNode
}

const WorkshopContextProvider = ({children}: WorkshopContextProviderProps) => {
    const socket = useRef<Socket>(io({autoConnect: false }));
    const [connected, setConnected] = useState(false);

    const connect = () => {
        if (socket.current.connected) return;

        console.info('Trying to connect to the server...');

        socket.current.auth = {
            token: 'test'
        }
        socket.current?.connect();

        socket.current.on('connect', () => {
            console.info('Succesfully connected to the server');
            socket.current.emit(WorkshopSocketTypes.WorkshopConnect, 'test');
        });

        socket.current.on(WorkshopSocketTypes.WorkshopConnect, ()=> {
            setConnected(true);
        })

        socket.current.on(WorkshopSocketTypes.WorkshopData, (data) => {
            console.log('workshop data');
            console.log(data);
        });
    }

    return (
        <WorkshopContext.Provider value={{
            socket: socket.current,
            connect: connect,
            connected: connected
        }}>
            { children }
        </WorkshopContext.Provider>
    )
}


type WorkshopContextProps = {
    socket: null | Socket,
    connect: () => void,
    connected: boolean
}

const WorkshopContext = React.createContext<WorkshopContextProps>({
    socket: null,
    connect: () => {
        // eslint-disable-next-line no-console
        console.warn('WorkshopContext.connect was called, but was not found in Context');
    },
    connected: false
});

export { WorkshopContextProvider, WorkshopContext }