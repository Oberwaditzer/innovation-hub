import * as socketio from 'socket.io';
import {WorkshopSocketTypes} from "../definitions/WorkshopSocketTypes";

const OnConnection = (socket: socketio.Socket) => {
    console.log('client connected');
    socket.on(WorkshopSocketTypes.WorkshopConnect, data => {
        setTimeout(()=>{
            socket.emit(WorkshopSocketTypes.WorkshopConnect, 'test');
        }, 1000)
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
}


export { OnConnection }