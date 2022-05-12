import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useContext, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { timerState } from '../../../state/atoms/timer';
import { MdWarning } from 'react-icons/md';
import { Spinner } from '../../spinner/Spinner';
import { userState } from '../../../state/atoms/user';
import { reviewModeState } from '../../../state/atoms/reviewMode';
import { Modal } from '../../modals/Modal';
import { WorkshopSocketModuleReview } from '../../../../backend/workshop/socket/resolvers/HandleModuleReview';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { WorkshopContext } from '../../../context/WorkshopContext';

const WorkshopBlocker = () => {
   const { timeLeft, isActive } = useRecoilValue(timerState);
   const isReview = useRecoilValue(reviewModeState);
   const context = useContext(WorkshopContext);
   const { isFacilitator } = useRecoilValue(userState);
   const cancelButtonRef = useRef(null);

   const open = timeLeft === 0 && isActive && !isReview;

   const onReviewMode = () => {
      const sendData: WorkshopSocketModuleReview = { inReview: true };
      context.sendData(WorkshopSocketEvents.WorkshopModuleReview, sendData);
   };
   const footer = () => {
      if (isFacilitator) {
         return (
            <div className="mt-5 sm:mt-4 sm:ml-10 sm:pl-4 sm:flex">
               <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                  onClick={() => null}
                  ref={cancelButtonRef}
               >
                  Add one Minute
               </button>
               <button
                  type="button"
                  className="mt-3 sm:ml-3 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                  onClick={onReviewMode}
               >
                  Go into review mode
               </button>
            </div>
         );
      } else {
         return (
            <div className="mt-5 sm:mt-4 sm:flex justify-center">
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
