import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SocketServerHandlerType } from '../SockerServer';
import { removeModuleUserData } from '../../RedisAdapter';
import { WorkshopRemoveInput } from '../../../../definitions/WorkshopDataTypes';


const HandleWorkshopUserRemove = async ({
                                           socket,
                                           workshopId,
                                           userId,
                                           data,
                                           io,
                                        }: SocketServerHandlerType<WorkshopRemoveInput>) => {
   await removeModuleUserData(workshopId, data!.id);
   io.to(workshopId).emit(WorkshopSocketEvents.WorkshopUserRemove, data);
};


export default HandleWorkshopUserRemove;
