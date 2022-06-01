import React from 'react';
import { useRecoilValue } from 'recoil';
import { workshopModule } from '../../../state/atoms/workshop';
import { reviewModeState } from '../../../state/atoms/reviewMode';
import { resultsModeState } from '../../../state/atoms/inResults';

const WorkshopTitle = () => {
   const module = useRecoilValue(workshopModule);
   const isReview = useRecoilValue(reviewModeState);
   const isResult = useRecoilValue(resultsModeState);

   if(isResult) {
      return (
         <p className={'text-gray-300 text-xl  tracking-[0.75em]'}>
           Results
         </p>
      )
   }

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
