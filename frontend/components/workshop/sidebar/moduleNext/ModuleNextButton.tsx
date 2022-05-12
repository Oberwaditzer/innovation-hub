import React, { useContext } from 'react';
import { MdArrowForward } from 'react-icons/md';
import { Button } from '../../../button/Button';
import { WorkshopSocketEvents } from '../../../../../definitions/WorkshopSocketEvents';
import { WorkshopContext } from '../../../../context/WorkshopContext';
import { useRecoilValue } from 'recoil';
import { workshopSidebarExpandedState } from '../../../../state/atoms/workshopSidebar';
import { userState } from '../../../../state/atoms/user';
import { reviewModeState } from '../../../../state/atoms/reviewMode';
import { WorkshopSocketModuleReview } from '../../../../../backend/workshop/socket/resolvers/HandleModuleReview';

const ModuleNextButton = () => {
   const context = useContext(WorkshopContext);
   const expanded = useRecoilValue(workshopSidebarExpandedState);
   const isReviewMode = useRecoilValue(reviewModeState);
   const { isFacilitator } = useRecoilValue(userState);
   if (!isFacilitator) return null;
   const onClick = () => {
      if (!isReviewMode) {
         const sendData: WorkshopSocketModuleReview = { inReview: true };
         context.sendData(WorkshopSocketEvents.WorkshopModuleReview, sendData);
      } else {
         context.sendData(WorkshopSocketEvents.WorkshopModuleNext, {});
      }
   };
   return (
      <Button className={'p-2 w-10 h-10'} onClick={onClick} rounded={true}>
         <MdArrowForward className="h-6 w-6" aria-hidden="true" />
      </Button>
   );
};

export { ModuleNextButton };
