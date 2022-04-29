import React from 'react';
import { useRecoilValue } from 'recoil';
import { workshopModule, workshopState } from '../../../state/atoms/workshop';

const WorkshopTitle = () => {
   const module = useRecoilValue(workshopModule);
   if (!module) {
      return null;
   }
   return (
      <p className={'text-gray-300 text-xl  tracking-[0.75em]'}>
         {module.title.toUpperCase()}
      </p>
   );
};

export { WorkshopTitle };
