import React, { useContext } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import classNames from 'classnames';
import { WorkshopContext } from '../../../../context/WorkshopContext';
import { moduleUserDataState, workshopModule } from '../../../../state/atoms/workshop';
import { useRecoilValue } from 'recoil';
import {
   WorkshopAddInputVotingTypeVote,
   WorkshopAddOutput,
   WorkshopAddOutputVotingTypeVote,
   WorkshopRemoveInput,
} from '../../../../../definitions/WorkshopDataTypes';
import { WorkshopSocketEvents } from '../../../../../definitions/WorkshopSocketEvents';
import { userState } from '../../../../state/atoms/user';
import { VotingConfiguration } from '../../../../../definitions/WorkshopModuleConfiguration';
import { reviewModeState } from '../../../../state/atoms/reviewMode';
import { votingDataVotesByUserState, votingDataVotesState } from '../../../../state/atoms/workshopModules/voting';

type VotingCounterProps = {
   data: WorkshopAddOutput
}

const VotingCounter = ({ data }: VotingCounterProps) => {
   const { sendData } = useContext(WorkshopContext);
   const user = useRecoilValue(userState);
   const moduleData = useRecoilValue(votingDataVotesState);
   const moduleDataFiltered = moduleData.filter(e => e.data.dataId === data.id);
   const moduleInformation = useRecoilValue(workshopModule);
   const isReview = useRecoilValue(reviewModeState);
   const votesUsed = useRecoilValue(votingDataVotesByUserState);

   const votesAllowed = (moduleInformation?.configuration as VotingConfiguration)?.voteAmount ?? 0;

   const votedAmount = moduleDataFiltered.reduce((previousValue, currentValue) => {
      if (currentValue.data.isUp) return previousValue + 1;
      return previousValue - 1;
   }, 0);


   const canVoteDown = votedAmount !== 0 && moduleDataFiltered.some(e => e.data.isUp && e.userId === user.userId) && !isReview;
   const canVoteUp = votesUsed < votesAllowed && !isReview;

   const handleClick = (isUp: boolean) => {
      if (!canVoteDown && !isUp) return;
      if (!canVoteUp && isUp) return;
      if (votedAmount === 0 && !isUp) return;
      if (isUp) {
         const output: WorkshopAddInputVotingTypeVote = {
            data: {
               isUp: isUp,
               dataId: data.id,
            },
            type: 'voting',
            relevantForNextModule: false
         };
         sendData(WorkshopSocketEvents.WorkshopUserAdd, output);
      } else {
         const output: WorkshopRemoveInput = {
            id: moduleDataFiltered.find(e => e.data.isUp && e.userId === user.userId)!.id,
         };
         sendData(WorkshopSocketEvents.WorkshopUserRemove, output);
      }

   };

   return (
      <div className={'flex flex-col items-center'}>
         <MdKeyboardArrowUp
            onClick={() => handleClick(true)}
            className={classNames('w-10 h-10 ', {
               'cursor-pointer text-gray-400': canVoteUp,
               'text-gray-200 cursor-not-allowed': !canVoteUp,
            })} />
         <p className={'text-blue-300 text-3xl'}>{votedAmount}</p>
         <MdKeyboardArrowDown
            onClick={() => handleClick(false)}
            className={classNames('w-10 h-10 ', {
               'cursor-pointer text-gray-400': canVoteDown,
               'text-gray-200 cursor-not-allowed': !canVoteDown,
            })} />
      </div>
   );
};

export { VotingCounter };