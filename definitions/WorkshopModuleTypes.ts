import { BrainstormingModule } from '../frontend/components/workshop/modules/Brainstorming/BrainstormingModule';

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
];

export { WorkshopModuleDefinitions };
