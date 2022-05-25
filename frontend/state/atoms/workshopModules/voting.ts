import { selector } from 'recoil';
import { userState } from '../user';
import { moduleUserDataState, workshopModule, workshopUsers } from '../workshop';
import {
   WorkshopAddOutputVotingTypeSelect,
   WorkshopAddOutputVotingTypeVote,
} from '../../../../definitions/WorkshopDataTypes';


const votingDataVotesState = selector({
   key: 'module/data/voting/votes',
   get: ({ get }) => {
      const module = get(workshopModule);
      if (module?.type !== 'voting') return [];
      const data = get(moduleUserDataState) as (WorkshopAddOutputVotingTypeSelect | WorkshopAddOutputVotingTypeVote)[];
      return data.filter(e => e.type === 'voting') as WorkshopAddOutputVotingTypeVote[];
   },
});

const votingDataVotesByUserState = selector({
   key: 'module/data/voting/byUser',
   get: ({ get }) => {
      const module = get(workshopModule);
      if (module?.type !== 'voting') return 0;
      const user = get(userState);
      const moduleData = get(votingDataVotesState);
      return moduleData.reduce((previousValue, currentValue) => {
         if (currentValue.userId === user.userId) return previousValue + 1;
         return previousValue;
      }, 0);
   },
});

const votingDataSelectState = selector({
   key: 'module/data/voting/select',
   get: ({ get }) => {
      const module = get(workshopModule);
      if (module?.type !== 'voting') return [];
      const data = get(moduleUserDataState) as (WorkshopAddOutputVotingTypeSelect | WorkshopAddOutputVotingTypeVote)[];
      return data.filter(e => e.type === 'select') as WorkshopAddOutputVotingTypeSelect[];
   },
});

export { votingDataVotesState, votingDataSelectState, votingDataVotesByUserState };