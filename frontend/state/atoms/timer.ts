import { atom, selector } from 'recoil';

const timerState = atom({
   key: 'workshop/timer',
   default: {
      isActive: false,
      timeLeft: 0,
      initialTime: 0,
   },
});

const timeLeftState = selector({
   key: 'workshop/timer/timeleft',
   get: ({ get }) => {
      const timer = get(timerState);
      const minutes = Math.floor(timer.timeLeft / 60);
      const seconds = timer.timeLeft - minutes * 60;
      return {
         minutes: minutes,
         seconds: seconds,
      };
   },
});

export { timerState, timeLeftState };
