import React, { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { workshopSidebarExpandedState } from '../../../state/atoms/workshopSidebar';
import classNames from 'classnames';
import { Button } from '../../button/Button';
import { MdAdd, MdArrowForward, MdRemove, MdTimer } from 'react-icons/md';
import { WorkshopContext } from '../../../context/WorkshopContext';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';

const WorkshopSidebar = () => {
   const [sidebarExpanded, setSidebarExpanded] = useRecoilState(
      workshopSidebarExpandedState,
   );

   const toggle = () => {
      setSidebarExpanded(!sidebarExpanded);
   };

   return (
      <div className={'p-10'}>
         <div
            className={classNames(
               'transition-width bg-gray-100 h-full rounded-3xl transform duration-300 relative',
               {
                  'w-[350px]': sidebarExpanded,
                  'w-[96px]': !sidebarExpanded,
               },
            )}
         >
            <Button
               className={'absolute -right-6 top-10'}
               onClick={toggle}
               rounded={true}
            >
               {sidebarExpanded && (
                  <MdRemove className="h-6 w-6" aria-hidden="true" />
               )}
               {!sidebarExpanded && (
                  <MdAdd className="h-6 w-6" aria-hidden="true" />
               )}
            </Button>
            <WorkshopSidebarContent />
         </div>
      </div>
   );
};

const WorkshopSidebarContent = () => {
   const context = useContext(WorkshopContext);

   const goToNextScreen = () => {
      context.sendData(WorkshopSocketEvents.WorkshopModuleNext, {});
   };

   return (
      <div className={'h-full w-full flex flex-initial flex-col pt-32 p-7'}>
         <div className={'flex flex-auto flex-col'}>
            <WorkshopSidebarIcon />
         </div>
         <Button
            className={'p-2 w-10 h-10'}
            onClick={goToNextScreen}
            rounded={true}
         >
            <MdArrowForward className="h-6 w-6" aria-hidden="true" />
         </Button>
      </div>
   );
};

const WorkshopSidebarIcon = () => {
   const sidebarExpanded = useRecoilValue(workshopSidebarExpandedState);
   return (
      <MdTimer
         className={classNames(
            'h-10 w-10 text-blue-600 transition-spacing duration-300',
         )}
         aria-hidden="true"
      />
   );
};

export { WorkshopSidebar };
