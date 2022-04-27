import {useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {useRecoilState, useSetRecoilState} from "recoil";
import {moduleActiveState} from "../state/atoms/workshop";


let socket:Socket<DefaultEventsMap, DefaultEventsMap>|null;

const useSocketIO = () => {
    const setModuleActive = useSetRecoilState(moduleActiveState);

    const socketInitializer = async () => {
        console.log('in initialize')
        socket = io('localhost:3002');

        socket.on('connect', ()=>{
            console.log('Client: Connected');
            setTimeout(()=>{
                console.log('should send from client')
                socket!.emit('test', 'hallöle');
            }, 100)
        })

        socket.on('module_state', (args)=> {
            console.log("in here");
            console.log(args);
            setModuleActive(1);
        })
    }
    useEffect(()=>{
        if(!socket) {
            socketInitializer();
        }
        return () => {
            socket?.close();
        }
    }, []);

    return {
        emit: (event: string, data: string) => socket?.emit(event, data)
    }
}

export {useSocketIO}