import React, { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { modulePreviousUserData, workshopModule } from '../../../../state/atoms/workshop';
import { userState } from '../../../../state/atoms/user';
import { WorkshopContext } from '../../../../context/WorkshopContext';
import { reviewModeState } from '../../../../state/atoms/reviewMode';
import { MdArrowForward } from 'react-icons/md';
import { TextField } from '../../../input/TextField';
import { RephrasingList } from './RephrasingList';

const RephrasingModule = () => {
   const module = useRecoilValue(workshopModule);
   const user = useRecoilValue(userState);
   const isReview = useRecoilValue(reviewModeState);
   if (!module) {
      return null;
   }
   return (
      <div className={'w-full h-full flex flex-initial flex-col items-center'}>
         <p className={'font-semibold text-2xl mt-32 w-128 text-center'}>
            {module.title}
         </p>
         <p className={'mt-5 w-128 text-center'}>
            {module.description}
         </p>
         <div className={'flex w-full mt-16 justify-center mb-16'}>
            <div className='w-1/2 h-[1px] bg-gray-300' />
         </div>
         <div className={'w-3/4'}>
            <div className={'w-full flex flex-row font-bold text-2xl text-center mb-5'}>
               <div className={'flex-1'}>
                  Sharpen the aim
               </div>
               <div className={'flex-1'}>
                  Job to get done
               </div>
            </div>
            <RephrasingList />
         </div>
      </div>
   );
};

export { RephrasingModule };