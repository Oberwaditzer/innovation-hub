import { createClient } from 'redis';
import { WorkshopAddInput, WorkshopAddOutput } from '../../definitions/WorkshopDataTypes';
import { WorkshopTimeEntry } from './utils/WorkshopTimeHandling';

const client = async () => {
   const client = createClient();

   client.on('error', (err) => console.log('Redis Client Error', err));

   await client.connect();
   return client;
};


const addUserOnline = async (workshop: string, userId: string) => {
   await (await client()).sAdd(`${workshop}:users:online`, userId);
};

const removeUserOnline = async (workshop: string, userId: string) => {
   await (await client()).sRem(`${workshop}:users:online`, userId);
};

const getUsersOnline = async (workshop: string) => {
   return await (await client()).sMembers(`${workshop}:users:online`);
};

const addUserFinished = async (workshop: string, userId: string) => {
   await (await client()).sAdd(`${workshop}:users:finished`, userId);
};

const removeUserFinished = async (workshop: string, userId: string) => {
   await (await client()).sRem(`${workshop}:users:finished`, userId);
};

const getUsersFinished = async (workshop: string) => {
   return await (await client()).sMembers(`${workshop}:users:finished`);
};

const clearUsersFinished = async (workshop: string) => {
   return await (await client()).del(`${workshop}:users:finished`);
};

const getWorkshopStep = async (workshop: string) => {
   const step = await (await client()).get(`${workshop}:step`);
   if (step) {
      return parseInt(step);
   }
   return null;
};

const incrementWorkshopStep = async (workshop: string) => {
   return await (await client()).incr(`${workshop}:step`);
};

const setModuleReview = async (workshop: string, isReview: boolean) => {
   return await (await client()).set(`${workshop}:module:review`, isReview.toString());
};

const getModuleReview = async (workshop: string) => {
   const value = await (await client()).get(`${workshop}:module:review`);
   if (value) {
      return JSON.parse(value);
   }
   return false;
};

const getModuleUserData = async (workshop: string) => {
   const data = await (await client()).lRange(`${workshop}:module:data`, 0, -1);
   if (data) {
      try {
         return data
            .map((e) => JSON.parse(e) as WorkshopAddOutput)
            .reverse();
      } catch (_) {
      }
   }
   return null;
};

const addModuleUserData = async (
   workshop: string,
   data: WorkshopAddOutput,
) => {
   return await (await client()).lPush(`${workshop}:module:data`, JSON.stringify(data));
};

const removeModuleUserData = async (workshop: string, id: string) => {
   const currentData = await getModuleUserData(workshop);
   if (!currentData) return;
   const data = currentData.find((e) => e.id === id);
   if (data) {
      await (await client()).lRem(`${workshop}:module:data`, 0, JSON.stringify(data));
   }
};

const changeModuleUserData = async (workshop: string, data: WorkshopAddOutput) => {
   const currentData = await getModuleUserData(workshop);
   if (!currentData) return;
   const index = currentData.findIndex((e) => e.id === data.id);
   if (index >= 0) {
      const element = currentData[index];
      element.data = data.data;
      await (await client()).lSet(`${workshop}:module:data`, index, JSON.stringify(element));
   }
};

const clearModuleUserData = async (workshop: string) => {
   return await (await client()).del(`${workshop}:module:data`);
};

const getModuleTimes = async (workshop: string) => {
   const data = await (await client()).lRange(`${workshop}:module:times`, 0, -1);
   if (data) {
      try {
         return data
            .map((e) => JSON.parse(e) as WorkshopTimeEntry)
            .reverse();
      } catch (_) {
      }
   }
   return null;
};

const clearModuleTimes = async (workshop: string) => {
   return await (await client()).del(`${workshop}:module:times`);
};

const appendModuleTimes = async (workshop: string, data: WorkshopTimeEntry) => {
   await (await client()).lPush(`${workshop}:module:times`, JSON.stringify(data));
};

const getModuleStartTime = async (workshop: string) => {
   const res = await (await client()).get(`${workshop}:module:start`);
   if (!res) return 0;
   try {
      return parseInt(res);
   } catch (e) {
      console.error('Could not parse getModuleStartTime');
   }
   return 0;
};

const setWorkshopInResults = async (workshop: string, inReview: boolean) => {
   await (await client()).set(`${workshop}:inResults`, inReview.toString());
};

const getWorkshopInResults = async (workshop: string) => {
   const res = await (await client()).get(`${workshop}:inResults`);
   return res === 'true';
};

const clearWorkshop = async (workshop: string) => {
   const keys = await (await client()).keys(`${workshop}:*`)
   for (let i = 0; i < keys.length; i++) {
      await (await client()).del(keys[i]);
   }
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
   appendModuleTimes,
   getModuleTimes,
   getModuleStartTime,
   getWorkshopInResults,
   setWorkshopInResults,
   changeModuleUserData,
   clearModuleTimes,
   clearWorkshop
};
