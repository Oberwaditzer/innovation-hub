import React, { useContext } from 'react';
import { MdArrowForward, MdDone, MdClear } from 'react-icons/md';
import { Button } from '../../../button/Button';
import { WorkshopSocketEvents } from '../../../../../definitions/WorkshopSocketEvents';
import { WorkshopContext } from '../../../../context/WorkshopContext';
import { useRecoilValue } from 'recoil';
import { workshopSidebarExpandedState } from '../../../../state/atoms/workshopSidebar';
import { userState } from '../../../../state/atoms/user';
import { reviewModeState } from '../../../../state/atoms/reviewMode';
import { WorkshopSocketModuleReview } from '../../../../../backend/workshop/socket/resolvers/HandleModuleReview';
import { WorkshopSocketUserFinished } from '../../../../../backend/workshop/socket/resolvers/HandleUserFinished';
import { isUserFinishedState } from '../../../../state/atoms/workshop';

const ModuleNextButton = () => {
   const context = useContext(WorkshopContext);
   const expanded = useRecoilValue(workshopSidebarExpandedState);
   const isReviewMode = useRecoilValue(reviewModeState);
   const { isFacilitator, userId } = useRecoilValue(userState);
   const isUserFinished = useRecoilValue(isUserFinishedState);

   const onClickFacilitator = () => {
      if (!isReviewMode) {
         const sendData: WorkshopSocketModuleReview = { inReview: true };
         context.sendData(WorkshopSocketEvents.WorkshopModuleReview, sendData);
      } else {
         context.sendData(WorkshopSocketEvents.WorkshopModuleNext, {});
      }
   };

   const onClickUser = () => {
      const data: WorkshopSocketUserFinished = {
         isFinished: !isUserFinished,
         userId: userId,
      };
      context.sendData(WorkshopSocketEvents.WorkshopUserFinished, data);
   };

   if (!isFacilitator)
      return (
         <Button
            className={'p-2 w-10 h-10'}
            onClick={onClickUser}
            rounded={true}
         >
            {isUserFinished ? (
               <MdClear className="h-6 w-6" aria-hidden="true" />
            ) : (
               <MdDone className="h-6 w-6" aria-hidden="true" />
            )}
         </Button>
      );

   return (
      <Button
         className={'p-2 w-10 h-10'}
         onClick={onClickFacilitator}
         rounded={true}
      >
         <MdArrowForward className="h-6 w-6" aria-hidden="true" />
      </Button>
   );
};

export { ModuleNextButton };