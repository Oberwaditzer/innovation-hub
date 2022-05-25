import React from 'react';
import { useRecoilValue } from 'recoil';
import { modulePreviousUserData } from '../../../../state/atoms/workshop';
import { VotingEntry } from './VotingEntry';
import {
   WorkshopAddInputBrainstorming,
   WorkshopAddOutputBrainstorming,
} from '../../../../../definitions/WorkshopDataTypes';
import { TextField } from '../../../input/TextField';
import { WorkshopSocketEvents } from '../../../../../definitions/WorkshopSocketEvents';
import { BrainstormingResults } from '../Brainstorming/Results';
import { VotingDescription } from './VotingDescription';
import { reviewModeState } from '../../../../state/atoms/reviewMode';
import { votingDataVotesState } from '../../../../state/atoms/workshopModules/voting';


const VotingModule = () => {
   let data = useRecoilValue(modulePreviousUserData);
   const votes = useRecoilValue(votingDataVotesState);
   const isReview = useRecoilValue(reviewModeState);

   let sortedData = [...data];

   if (isReview) {
      sortedData = sortedData.sort((a, b) => {
         const aAmount = votes.filter(e => e.data.dataId === a.id).length;
         const bAmount = votes.filter(e => e.data.dataId === b.id).length;
         if(aAmount > bAmount) return -1;
         if(aAmount < bAmount) return 1;
         return 0;
      });
   }
   return (
      <div className={'w-full h-full flex flex-initial flex-col items-center'}>
         <p className={'font-semibold text-2xl mt-32 w-128 text-center'}>
            Wähle deine Favouriten
         </p>
         <VotingDescription />
         <div className={'w-1/2 mt-10'}>
            {sortedData.map((e, i) => <VotingEntry key={i.toString()} data={e as WorkshopAddOutputBrainstorming} />)}
         </div>
      </div>

   );
};

export { VotingModule };