import {createClient} from 'redis';
import {JsonObject} from 'type-fest';
import {WorkshopSocketUserAdd} from './socket/resolvers/HandleWorkshopUserAdd';

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

const addUserOnline = async (workshop: string, userId: string) => {
    await client.sAdd(`${workshop}:users:online`, userId);
};

const removeUserOnline = async (workshop: string, userId: string) => {
    await client.sRem(`${workshop}:users:online`, userId);
};

const getUsersOnline = async (workshop: string) => {
    return await client.sMembers(`${workshop}:users:online`);
};

const addUserFinished = async (workshop: string, userId: string) => {
    await client.sAdd(`${workshop}:users:finished`, userId);
};

const removeUserFinished = async (workshop: string, userId: string) => {
    await client.sRem(`${workshop}:users:finished`, userId);
};

const getUsersFinished = async (workshop: string) => {
    return await client.sMembers(`${workshop}:users:finished`);
};

const clearUsersFinished = async (workshop: string) => {
    return await client.del(`${workshop}:users:finished`);
};

const getWorkshopStep = async (workshop: string) => {
    const step = await client.get(`${workshop}:step`);
    if (step) {
        return parseInt(step);
    }
    return null;
};

const incrementWorkshopStep = async (workshop: string) => {
    return await client.incr(`${workshop}:step`);
};

const setModuleReview = async (workshop: string, isReview: boolean) => {
    return await client.set(`${workshop}:module:review`, isReview.toString());
};

const getModuleReview = async (workshop: string) => {
    const value = await client.get(`${workshop}:module:review`);
    if (value) {
        return JSON.parse(value);
    }
    return false;
};

const getModuleUserData = async (workshop: string) => {
    const data = await client.lRange(`${workshop}:module:data`, 0, -1);
    if (data) {
        try {
            return data
                .map((e) => JSON.parse(e) as WorkshopSocketUserAdd)
                .reverse();
        } catch (_) {
        }
    }
    return null;
};

const addModuleUserData = async (
    workshop: string,
    data: WorkshopSocketUserAdd,
) => {
    return await client.lPush(`${workshop}:module:data`, JSON.stringify(data));
};

const removeModuleUserData = async (workshop: string, id: string) => {
    const currentData = await getModuleUserData(workshop);
    if (!currentData) return;
    const data = currentData.find((e) => e.id === id);
    if (data) {
        await client.lRem(`${workshop}:module:data`, 0, JSON.stringify(data));
    }
};

const clearModuleUserData = async (workshop: string) => {
    return await client.del(`${workshop}:module:data`);
};

const setModuleStartTime = async (workshop: string, startTime: number) => {
    await client.set(`${workshop}:module:start`, startTime);
}

const getModuleStartTime = async (workshop: string) => {
    const res = await client.get(`${workshop}:module:start`);
    if(!res)return 0;
    try{
        return parseInt(res);
    }catch (e){
        console.error('Could not parse getModuleStartTime')
    }
    return 0;
}

export {
    addUserOnline,
    removeModuleUserData,
    removeUserOnline,
    getUsersOnline,
    getWorkshopStep,
    incrementWorkshopStep,
    getModuleUserData,
    addModuleUserData,
    clearModuleUserData,
    setModuleReview,
    getModuleReview,
    addUserFinished,
    removeUserFinished,
    getUsersFinished,
    clearUsersFinished,
    setModuleStartTime,
    getModuleStartTime
};
