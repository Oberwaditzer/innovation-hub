import { BrainstormingModule } from '../frontend/components/workshop/modules/Brainstorming/BrainstormingModule';
import { VotingModule } from '../frontend/components/workshop/modules/Voting/VotingModule';

enum WorkshopModuleIOTypes {
	NONE = 'NONE',
	SINGLE = 'SINGLE',
	MULTI = 'MULTI',
}

type WorkshopModuleTypes = {
	key: string;
	input: WorkshopModuleIOTypes;
	output: WorkshopModuleIOTypes;
	component: () => JSX.Element | null;
};

const WorkshopModuleDefinitions: WorkshopModuleTypes[] = [
	{
		key: 'brainstorming',
		input: WorkshopModuleIOTypes.NONE,
		output: WorkshopModuleIOTypes.MULTI,
		component: BrainstormingModule,
	},
	{
		key: 'voting',
		input: WorkshopModuleIOTypes.MULTI,
		output: WorkshopModuleIOTypes.MULTI,
		component: VotingModule,
	},
];

export { WorkshopModuleDefinitions };
