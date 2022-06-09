import React from 'react';
import classNames from 'classnames';

type StepperProps = {
   data: {
      headline: string,
      info: string
   }[],
   currentStep: number
   stepsVisible?: number[]
}

//ToDo currently only vertical
const Stepper = ({ data, currentStep, stepsVisible }: StepperProps) => {

   if (stepsVisible == null) {
      stepsVisible = [0, data.length - 1];
   }

   return (
      <div className={'w-full flex flex-col'}>
         {
            data
               .filter((e, i) => i >= stepsVisible![0] && i <= stepsVisible![1])
               .map((e, i) => (
                  <div key={i.toString()} className={'flex flex-row'}>
                     <div className={'mx-4 flex flex-col items-center'}>
                        <div
                           className={classNames('rounded-full flex justify-center items-center w-8 h-8', {
                              'bg-blue-500 text-white': (i + +stepsVisible![0]) <= currentStep,
                              'border-2 border-blue-500 text-blue-500': (i + +stepsVisible![0]) > currentStep,
                           })}>{(i + 1 + stepsVisible![0]).toString()}</div>
                        {
                           (i + +stepsVisible![0]) < stepsVisible![1] && (
                              <div className={'flex-1 w-1 bg-blue-500'} />
                           )
                        }
                     </div>
                     <div className={'flex-1 p-2 bg-white mb-3 rounded-xl'}>
                        <p>{e.headline}</p>
                        <p className={'font-light text-sm'}>{e.info}</p>
                     </div>
                  </div>
               ))
         }
      </div>
   );
};

export { Stepper };