import React, { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { moduleUserDataState, workshopModule, workshopUsers } from '../../../../state/atoms/workshop';
import classNames from 'classnames';
import { Avatar } from '../../../avatars/Avatar';
import { VotingCounter } from './VotingCounter';
import {
   WorkshopAddInputVotingTypeSelect,
   WorkshopAddOutputBrainstorming,
   WorkshopAddOutputVotingTypeSelect,
   WorkshopAddOutputVotingTypeVote, WorkshopRemoveInput,
} from '../../../../../definitions/WorkshopDataTypes';
import { userState } from '../../../../state/atoms/user';
import { reviewModeState } from '../../../../state/atoms/reviewMode';
import { WorkshopContext } from '../../../../context/WorkshopContext';
import { WorkshopSocketEvents } from '../../../../../definitions/WorkshopSocketEvents';
import { VotingConfiguration } from '../../../../../definitions/WorkshopModuleConfiguration';
import { votingDataSelectState, votingDataVotesState } from '../../../../state/atoms/workshopModules/voting';


type VotingEntryProps = {
   data: WorkshopAddOutputBrainstorming
}

const VotingEntry = ({ data }: VotingEntryProps) => {
   const { sendData } = useContext(WorkshopContext);

   const users = useRecoilValue(workshopUsers);
   const personalUser = useRecoilValue(userState);
   const isInReview = useRecoilValue(reviewModeState);
   const moduleInformation = useRecoilValue(workshopModule);
   const moduleDataVotes = useRecoilValue(votingDataVotesState);
   const moduleDataSelect = useRecoilValue(votingDataSelectState);

   const selectsAllowed = (moduleInformation?.configuration as VotingConfiguration)?.maxSelect ?? 0;


   const isElementSelected = moduleDataSelect.find(e => e.data.id === data.id);

   const userFromData = users?.find(e => e.id === data.userId)!;

   const votedByUser = moduleDataVotes.reduce((previousValue, currentValue) => {
      if (currentValue.userId === personalUser.userId && currentValue.data.isUp && data.id === currentValue.data.dataId) return previousValue + 1;
      return previousValue;
   }, 0);

   const selectForNextModule = () => {
      if (!personalUser.isFacilitator || !isInReview) return;
      if (isElementSelected) {
         const output: WorkshopRemoveInput = {
            id: isElementSelected.id,
         };
         sendData(WorkshopSocketEvents.WorkshopUserRemove, output);
      } else {
         if (selectsAllowed <= moduleDataSelect.length) return;
         const output: WorkshopAddInputVotingTypeSelect = {
            relevantForNextModule: true,
            type: 'select',
            data: {
               ...data.data,
               id: data.id,
            },
         };
         sendData(WorkshopSocketEvents.WorkshopUserAdd, output);
      }

   };

   return (
      <div className={'relative'}>
         {
            !isInReview &&
            <div
               className={'absolute -top-4 -right-4 rounded-full bg-blue-500 w-8 h-8 flex items-center justify-center text-white'}>
               {votedByUser}
            </div>
         }

         <div
            onClick={selectForNextModule}
            className={classNames('flex w-full rounded-3xl bg-gray-100 p-5 flex-row mb-3 items-center', {
               'cursor-pointer': isInReview && personalUser.isFacilitator,
               'bg-green-100': isElementSelected,
               'bg-gray-100': !isElementSelected,
            })}>
            {data.userId && <Avatar src={userFromData!.profilePictureURL} size={'l'} className={'mr-3'} />}
            <div className={'flex flex-1 flex-col'}>
               {data.userId && <p className={'text-lg mb-2'}>
                  {`${userFromData.firstName} ${userFromData.lastName}`}
               </p>}

               <p>{data?.data?.text ?? ''}</p>
            </div>
            <VotingCounter data={data} />
         </div>
      </div>
   );
};

export { VotingEntry };