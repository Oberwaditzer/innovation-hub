import React, { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
   moduleUserDataState,
   workshopModule,
} from '../../../../state/atoms/workshop';
import { TextField } from '../../../input/TextField';
import { WorkshopContext } from '../../../../context/WorkshopContext';
import { BrainstormingResults } from './Results';
import { WorkshopSocketEvents } from '../../../../../definitions/WorkshopSocketEvents';

const BrainstormingModule = () => {
   const module = useRecoilValue(workshopModule);
   const [moduleUserData, setWorkshopModuleData] =
      useRecoilState(moduleUserDataState);
   const { sendData } = useContext(WorkshopContext);
   if (!module) {
      return null;
   }
   return (
      <div className={'w-full h-full flex flex-initial flex-col items-center'}>
         <p className={'font-semibold text-2xl mt-32 w-128 text-center'}>
            {module.title}
         </p>
         <p className={'mt-5 w-128 text-center'}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labo.
         </p>
         <TextField
            className={'mt-16'}
            clearOnSubmit={true}
            placeholder={'Type your thoughts'}
            onSubmit={(userInput) => {
               const output = {
                  data: {
                     text: userInput,
                  },
                  userId: 'cl2kqu29z0027k0h59rgnv7bk',
                  private: false,
               };
               // ToDo
               setWorkshopModuleData((data) => [
                  ...data,
                  { ...output, isSelf: true },
               ]);
               sendData(WorkshopSocketEvents.WorkshopUserAdd, output);
            }}
         />
         <div className={'flex w-full mt-16 justify-center mb-16'}>
            <div className="w-1/2 h-[1px] bg-gray-300" />
         </div>
         <BrainstormingResults />
      </div>
   );
};

export { BrainstormingModule };
