import React from 'react';
import { useTimer } from '../../../../hooks/useTimer';
import { useRecoilValue } from 'recoil';
import { timeLeftState } from '../../../../state/atoms/timer';

const SidebarTimer = () => {
   const { seconds, minutes } = useRecoilValue(timeLeftState);

   const addLeadingZero = (value: number) => {
      if (value < 10) {
         return `0${value}`;
      }
      return value.toString();
   };

   const printValue = `${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
   return <p className={'text-xl text-gray-400'}>{printValue}</p>;
};

export { SidebarTimer };
