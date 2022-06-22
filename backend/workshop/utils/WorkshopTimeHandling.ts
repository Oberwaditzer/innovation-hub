import { appendModuleTimes, getModuleTimes } from '../RedisAdapter';
import { JsonObject } from 'type-fest';

type WorkshopTimeEntry = {
   timeStamp: number,
   action: 'start' | 'pause' | 'add',
   data?: {
      isPause?: boolean,
      timeToIncrease?: number
   }
}

const SetStartModule = async (workshopId: string) => {
   await appendModuleTimes(workshopId, {
      timeStamp: new Date().getTime(),
      action: 'start',
   });
};

const SetIncreaseTimeModule = async (workshopId: string, timeToIncrease: number) => {
   await appendModuleTimes(workshopId, {
      timeStamp: new Date().getTime(),
      action: 'add',
      data: {
         timeToIncrease,
      },
   });
};

const SetPauseModule = async (workshopId: string, isPause: boolean) => {
   await appendModuleTimes(workshopId, {
      timeStamp: new Date().getTime(),
      action: 'add',
      data: {
         isPause,
      },
   });
};

const GetTimeLeftModule = async (workshopId: string, initialTime: number) => {
   const currentTime = new Date().getTime();
   let moduleTimes = await getModuleTimes(workshopId);
   if (!moduleTimes) {
      return initialTime;
   }
   const result = moduleTimes.reduce((prev, current, index) => {
      if (current.action === 'start') {
         prev.lastTime = current.timeStamp;
         return prev;
      }

      if (current.action === 'pause') {
         if (!current.data?.isPause) {
            prev.timeLeft -= current.timeStamp - prev.lastTime;
         }
         prev.isPause = !!current.data?.isPause;
      }

      if (current.action === 'add') {
         if (!prev.isPause) {
            prev.timeLeft -= current.timeStamp - prev.lastTime;
         }
         if(prev.timeLeft < 0) {
            prev.timeLeft = 0;
         }
         prev.timeLeft += current.data!.timeToIncrease! * 1000;
      }

      if (prev.timeLeft < 0) {
         prev.timeLeft = 0;
      }
      prev.lastTime = current.timeStamp;
      return prev;
   }, {
      timeLeft: initialTime * 1000,
      isPause: false,
      lastTime: 0,
   });
   console.log(result);
   console.log(currentTime);
   console.log(Math.floor((result.timeLeft - (currentTime - result.lastTime)) / 1000));
   const timeLeft = Math.floor((result.timeLeft - (currentTime - result.lastTime)) / 1000);
   if (timeLeft < 0) {
      return 0;
   }
   return timeLeft;
};
export type { WorkshopTimeEntry };
export { SetPauseModule, SetStartModule, SetIncreaseTimeModule, GetTimeLeftModule };