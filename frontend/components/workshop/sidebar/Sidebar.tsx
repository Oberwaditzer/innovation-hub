import React, { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { workshopSidebarExpandedState } from '../../../state/atoms/workshopSidebar';
import classNames from 'classnames';
import { Button } from '../../button/Button';
import { MdAdd, MdArrowForward, MdRemove, MdTimer } from 'react-icons/md';
import { WorkshopContext } from '../../../context/WorkshopContext';
import { WorkshopSocketEvents } from '../../../../definitions/WorkshopSocketEvents';
import { SidebarTimer } from './timer/SidebarTimer';

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
   const expanded = useRecoilValue(workshopSidebarExpandedState);

   const goToNextScreen = () => {
      context.sendData(WorkshopSocketEvents.WorkshopModuleNext, {});
   };

   return (
      <div
         className={
            'h-full w-full flex flex-initial flex-col pt-32 p-7 overflow-hidden'
         }
      >
         <div className={'flex flex-auto flex-col'}>
            <WorkshopSidebarEntry
               icon={<WorkshopSidebarIcon />}
               iconSide={
                  <>
                     <p className={'text-xl ml-4'}>Time left</p>
                     <SidebarTimer />
                  </>
               }
               contentSmall={<SidebarTimer isSmall={true} />}
            />
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

type WorkshopSidebarEntryProps = {
   icon: React.ReactNode;
   iconSide: React.ReactNode;
   contentSmall: React.ReactNode;
};

const WorkshopSidebarEntry = ({
   icon,
   iconSide,
   contentSmall,
}: WorkshopSidebarEntryProps) => {
   const sidebarExpanded = useRecoilValue(workshopSidebarExpandedState);
   return (
      <div className={'flex flex-initial flex-col w-full'}>
         <div
            className={
               'flex flex-initial flex-row items-center w-full relative'
            }
         >
            {icon}
            <div
               className={classNames(
                  'flex flex-initial flex-row justify-between flex-1 absolute w-[254px] left-9 transition-opacity',
                  {
                     'opacity-0': !sidebarExpanded,
                     'opacity-1': sidebarExpanded,
                  },
               )}
            >
               {iconSide}
            </div>
         </div>
         <div
            className={classNames('w-full flex justify-center mt-3', {
               'opacity-1 max-h-2': !sidebarExpanded,
               'opacity-0 max-h-0': sidebarExpanded,
            })}
         >
            {contentSmall}
         </div>
      </div>
   );
};

const WorkshopSidebarIcon = () => {
   return (
      <MdTimer
         className={classNames('h-10 w-10 text-blue-600')}
         aria-hidden="true"
      />
   );
};

export { WorkshopSidebar };
