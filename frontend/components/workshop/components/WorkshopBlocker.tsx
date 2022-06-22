import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { timerState } from '../../../state/atoms/timer';
import { Spinner } from '../../spinner/Spinner';
import { userState } from '../../../state/atoms/user';
import { reviewModeState } from '../../../state/atoms/reviewMode';
import { Modal } from '../../modals/Modal';
import { WorkshopSocketModuleReview } from '../../../../backend/workshop/socket/resolvers/HandleModuleReview';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { WorkshopContext } from '../../../context/WorkshopContext';
import { WorkshopSocketIncreaseTime } from '../../../../backend/workshop/socket/resolvers/HandleIncreaseTime';
import { workshopStep } from '../../../state/atoms/workshop';
import { SelectButton } from '../../button/SelectButton';
import { AddOutlined } from '@material-ui/icons';

const addTimeOptions = [
   { key: "60", title: 'One Minute', description: 'Add one minute for all users.'},
   { key: "180", title: 'Three Minutes', description: 'Add three minutes for all users' },
   { key: "300", title: 'Five Minutes', description: 'Add five minutes for all users' },
];

const WorkshopBlocker = () => {
   const { sendData } = useContext(WorkshopContext);
   const { timeLeft, isActive } = useRecoilValue(timerState);
   const isReview = useRecoilValue(reviewModeState);
   const context = useContext(WorkshopContext);
   const { isFacilitator } = useRecoilValue(userState);
   const currentStep = useRecoilValue(workshopStep);
   const cancelButtonRef = useRef(null);
   const [open, setOpen] = useState(false);

   useEffect(() => {
      if (timeLeft === 0 && isActive && !isReview) {
         setOpen(true);
      }
   }, [timeLeft, isActive, isActive]);

   const increaseTime = (key: string) => {
      const data: WorkshopSocketIncreaseTime = {
         secondsToIncrease: parseInt(key),
         step: currentStep!,
      };

      sendData(WorkshopSocketEvents.WorkshopModuleTimeIncrease, data);
      setOpen(false);
   };

   const onReviewMode = () => {
      const sendData: WorkshopSocketModuleReview = { inReview: true };
      context.sendData(WorkshopSocketEvents.WorkshopModuleReview, sendData);
   };
   const footer = () => {
      if (isFacilitator) {
         return (
            <div className='mt-5 sm:mt-4 sm:ml-10 sm:pl-4 sm:flex'>
               <SelectButton className={'mt-3 w-full'} options={addTimeOptions} icon={<AddOutlined className='h-5 w-5' aria-hidden='true' />} onClick={increaseTime} />
               <button
                  type='button'
                  className='mt-3 sm:ml-3 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm'
                  onClick={onReviewMode}
               >
                  Go into review mode
               </button>
            </div>
         );
      } else {
         return (
            <div className='mt-5 sm:mt-4 sm:flex justify-center'>
               <Spinner />
            </div>
         );
      }
   };

   return (
      <Modal
         open={open}
         close={() => null}
         title={`Time's up`}
         description={
            'Your time for this module is up. Wait for the facilitator to continue or adding some additional time.'
         }
         footer={footer()}
      />
   );
};

export { WorkshopBlocker };
