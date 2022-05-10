import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { timerState } from '../state/atoms/timer';

const useTimer = () => {
   const setValue = useSetRecoilState(timerState);

   useEffect(() => {
      const interval = setInterval(() => {
         setValue((currVal) => {
            if (currVal.isActive && currVal.timeLeft > 0) {
               return {
                  ...currVal,
                  timeLeft: currVal.timeLeft - 1,
               };
            }
            return currVal;
         });
      }, 1000);
      return () => {
         clearInterval(interval);
      };
   });
};

export { useTimer };
