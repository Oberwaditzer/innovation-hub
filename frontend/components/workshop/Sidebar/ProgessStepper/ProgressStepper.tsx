import React from 'react';
import { Stepper } from '../../../Stepper/Stepper';
import { useRecoilValue } from 'recoil';
import { workshopStep, workshopSteps } from '../../../../state/atoms/workshop';
import { resultsModeState } from '../../../../state/atoms/inResults';

const ProgressStepper = () => {
   const steps = useRecoilValue(workshopSteps);
   const currentStep = useRecoilValue(workshopStep);
   const isInResults = useRecoilValue(resultsModeState)
   if (!steps || !currentStep) return null;

   const data = steps.map(e => ({
      headline: e.type.toUpperCase(),
      info: e.title,
   }));

   data.push({
      headline: 'Results'.toUpperCase(),
      info: ''
   })

   return (
      <div className={'mt-4'}>
         <Stepper
            data={data}
            currentStep={isInResults ? data.length : currentStep - 1}
            stepsVisible={[isInResults ? data.length -1 : currentStep - 1, Math.min(isInResults ? data.length -1 : currentStep + 1, data.length -1)]} />
      </div>
   );
};

export { ProgressStepper };