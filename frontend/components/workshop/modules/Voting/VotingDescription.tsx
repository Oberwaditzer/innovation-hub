import React from 'react';
import { useRecoilValue } from 'recoil';
import { votingDataSelectState, votingDataVotesByUserState } from '../../../../state/atoms/workshopModules/voting';
import { workshopModule } from '../../../../state/atoms/workshop';
import { VotingConfiguration } from '../../../../../definitions/WorkshopModuleConfiguration';
import { reviewModeState } from '../../../../state/atoms/reviewMode';

const VotingDescription = () => {
   const isReview = useRecoilValue(reviewModeState);
   const votesUsed = useRecoilValue(votingDataVotesByUserState);
   const moduleInformation = useRecoilValue(workshopModule);
   const votesAllowed = (moduleInformation?.configuration as VotingConfiguration)?.voteAmount ?? 0;
   const selectsAllowed = (moduleInformation?.configuration as VotingConfiguration)?.maxSelect ?? 0;

   const selectsUsed = useRecoilValue(votingDataSelectState);

   let text = `Du hast schon ${votesUsed}/${votesAllowed} Votes benutzt`;

   if(isReview) {
      text = `Es wurden ${selectsUsed.length}/${selectsAllowed} Elemente ausgewählt`;
   }

   return (
      <p className={'mt-5 w-128 text-center'}>
         {text}
      </p>
   )
}
export {VotingDescription}