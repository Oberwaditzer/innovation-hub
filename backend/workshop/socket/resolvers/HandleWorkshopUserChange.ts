import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import { changeModuleUserData } from '../../RedisAdapter';
import { WorkshopAddInput, WorkshopAddOutput } from '../../../../definitions/WorkshopDataTypes';


const HandleWorkshopUserChange = async ({
                                           socket,
                                           workshopId,
                                           userId,
                                           data,
                                           io,
                                        }: SocketServerHandlerType<WorkshopAddOutput>) => {
   await changeModuleUserData(workshopId, data!);
   io.to(workshopId).emit(WorkshopSocketEvents.WorkshopUserChange, data);
};


export default HandleWorkshopUserChange;
