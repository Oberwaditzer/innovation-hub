import { createClient } from 'redis';

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

export {
   addUserOnline,
   removeUserOnline,
   getUsersOnline,
   getWorkshopStep,
   incrementWorkshopStep,
};
