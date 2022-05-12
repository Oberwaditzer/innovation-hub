import React from 'react';
import { useTimer } from '../../../../hooks/useTimer';
import { useRecoilValue } from 'recoil';
import { timeLeftState } from '../../../../state/atoms/timer';
import classNames from 'classnames';

type SidebarTimerProps = {
   isSmall?: boolean;
};

const SidebarTimer = ({ isSmall = false }: SidebarTimerProps) => {
   const { seconds, minutes } = useRecoilValue(timeLeftState);

   const addLeadingZero = (value: number) => {
      if (value < 10) {
         return `0${value}`;
      }
      return value.toString();
   };

   const printValue = `${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
   return (
      <p
         className={classNames('text-xl text-gray-400', {
            'text-red-400': minutes === 0 && seconds < 30 && seconds % 2 === 0,
            'text-xs': isSmall,
         })}
      >
         {printValue}
      </p>
   );
};

export { SidebarTimer };
