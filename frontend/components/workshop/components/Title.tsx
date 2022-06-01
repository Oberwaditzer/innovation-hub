import React from 'react';
import { useRecoilValue } from 'recoil';
import { workshopModule, workshopState } from '../../../state/atoms/workshop';
import { reviewModeState } from '../../../state/atoms/reviewMode';

const WorkshopTitle = () => {
   const module = useRecoilValue(workshopModule);
   const isReview = useRecoilValue(reviewModeState);
   if (!module) {
      return null;
   }
   return (
      <p className={'text-gray-300 text-xl  tracking-[0.75em]'}>
         {`${module.type.toUpperCase()}${isReview ? ' (REVIEW)' : ''}`}
      </p>
   );
};

export { WorkshopTitle };
