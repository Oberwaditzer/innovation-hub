import React, { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { workshopSidebarExpandedState } from '../../../state/atoms/workshopSidebar';
import classNames from 'classnames';
import { Button } from '../../button/Button';
import {
   AddOutlined,
   PersonOutlineOutlined,
   RemoveOutlined,
   TimerOutlined,
   PieChartOutlined,
} from '@material-ui/icons';
import { SidebarTimer } from './Timer/SidebarTimer';
import { ModuleActionButton } from './ModuleAction/ModuleActionButton';
import { UserList, UsersFinished } from './Users/UserList';
import { Collapsable } from './collapsable/Collapsable';
import { ProgressStepper } from './ProgessStepper/ProgressStepper';
import { resultsModeState } from '../../../state/atoms/inResults';

const WorkshopSidebar = () => {
   const [sidebarExpanded, setSidebarExpanded] = useRecoilState(
      workshopSidebarExpandedState,
   );


   const isResult = useRecoilValue(resultsModeState);
   if(isResult) {
      return null
   }

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
                  <RemoveOutlined className='h-6 w-6' aria-hidden='true' />
               )}
               {!sidebarExpanded && (
                  <AddOutlined className='h-6 w-6' aria-hidden='true' />
               )}
            </Button>
            <WorkshopSidebarContent />
         </div>
      </div>
   );
};

const WorkshopSidebarContent = () => {
   return (
      <div
         className={
            'h-full w-full flex flex-initial flex-col pt-28 p-7 overflow-hidden'
         }
      >
         <div className={'flex flex-auto flex-col'}>
            <WorkshopSidebarEntry
               showDivider={true}
               icon={
                  <TimerOutlined
                     className={classNames('h-10 w-10 text-blue-600')}
                     aria-hidden='true'
                  />
               }
               iconSide={
                  <>
                     <p className={'text-l ml-4'}>Time left</p>
                     <SidebarTimer />
                  </>
               }
               contentSmall={<SidebarTimer isSmall={true} />}
            />
            <WorkshopSidebarEntry
               showDivider={true}
               icon={
                  <PersonOutlineOutlined
                     className={classNames('h-10 w-10 text-blue-600')}
                     aria-hidden='true'
                  />
               }
               iconSide={
                  <>
                     <p className={'text-l ml-4'}>Persons</p>
                  </>
               }
               contentBig={<UserList />}
               contentSmall={<UsersFinished />}
            />
            <WorkshopSidebarEntry
               showDivider={true}
               icon={
                  <PieChartOutlined
                     className={classNames('h-10 w-10 text-blue-600')}
                     aria-hidden='true'
                  />
               }
               iconSide={
                  <>
                     <p className={'text-l ml-4'}>Progress</p>
                  </>
               }
               contentBig={<ProgressStepper />}
               contentSmall={<UsersFinished />}
            />
         </div>
         <ModuleActionButton />
      </div>
   );
};

type WorkshopSidebarEntryProps = {
   icon: React.ReactNode;
   iconSide: React.ReactNode;
   contentSmall?: React.ReactNode;
   contentBig?: React.ReactNode;
   showDivider: boolean;
};

const WorkshopSidebarEntry = ({
                                 icon,
                                 iconSide,
                                 contentSmall,
                                 contentBig,
                                 showDivider = true,
                              }: WorkshopSidebarEntryProps) => {
   const sidebarExpanded = useRecoilValue(workshopSidebarExpandedState);
   return (
      <>
         <div className={classNames('flex flex-initial flex-col w-full mt-3')}>
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
                        'opacity-100': sidebarExpanded,
                     },
                  )}
               >
                  {iconSide}
               </div>
            </div>
            <div className={''}>
               {contentBig && (
                  <Collapsable width={true} height={true}>
                     {contentBig}
                  </Collapsable>
               )}
            </div>
            <div
               className={classNames('w-full flex justify-center', {
                  'opacity-100 max-h-4 mt-3': !sidebarExpanded,
                  'opacity-0 max-h-0': sidebarExpanded,
               })}
            >
               {contentSmall}
            </div>
         </div>
         <div
            className={classNames('', {
               'border-b border-gray-300 mt-3': showDivider,
            })}
         />
      </>
   );
};

export { WorkshopSidebar };
