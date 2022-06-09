import React, { useContext, useEffect } from 'react';
import { WorkshopContext } from '../../../frontend/context/WorkshopContext';
import { useRecoilValue } from 'recoil';
import { modulePreviousUserData, workshopModule } from '../../../frontend/state/atoms/workshop';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { WorkshopBlocker } from '../../../frontend/components/workshop/components/WorkshopBlocker';
import { WorkshopSidebar } from '../../../frontend/components/workshop/Sidebar/Sidebar';
import { WorkshopTitle } from '../../../frontend/components/workshop/components/Title';
import {
   redirectToCorrectWorkshopPage,
   RedirectToCorrectWorkshopPageEnum,
} from '../../../backend/Routing/WorkshopRouting';
import {
   WorkshopAddInputBrainstorming,
   WorkshopAddOutput,
   WorkshopAddOutputWithText,
} from '../../../definitions/WorkshopDataTypes';
import { TextField } from '../../../frontend/components/input/TextField';
import { WorkshopSocketEvents } from '../../../definitions/WorkshopSocketEvents';
import { BrainstormingResults } from '../../../frontend/components/workshop/modules/Brainstorming/Results';

const WorkshopResult = () => {
   const context = useContext(WorkshopContext);
   const module = useRecoilValue(workshopModule);
   const previousData = useRecoilValue(modulePreviousUserData);
   const { user } = useUser();

   useEffect(() => {
      if (user) context.connect();
   }, [context, user?.email]);
   if (!previousData) {
      return null;
   }

   return (
      <div className={'h-screen w-screen flex flex-initial flex-row'}>
         <WorkshopBlocker />
         <WorkshopSidebar />
         <div className={'w-full h-full flex flex-col items-center p-10'}>
            <WorkshopTitle />
            <div className={'w-full h-full flex flex-initial flex-col items-center'}>
               <p className={'font-semibold text-2xl mt-32 w-128 text-center'}>
                  Your outcome
               </p>
               <p className={'mt-5 w-128 text-center'}>
                 This is your output
               </p>
               <div className={'flex w-full mt-16 justify-center mb-16'}>
                  <div className="w-1/2 h-[1px] bg-gray-300"/>
               </div>
               <div className={'w-1/2'}>
                  {
                     previousData.map((e, i) => <ResultElement key={i.toString()} item={e as WorkshopAddOutputWithText} />)
                  }
               </div>
            </div>
         </div>
      </div>
   );
};

type ResultElementProps = {
   item: WorkshopAddOutputWithText
}

const ResultElement = ({ item }: ResultElementProps) => {
   return (
      <div className={'w-full bg-blue-200 p-4 rounded-3xl mb-3'}>
         {item.data.text}
      </div>
   );
};

export const getServerSideProps = withPageAuthRequired({
   returnTo: '/',
   async getServerSideProps(context) {
      const workshopId = context.query.workshop?.toString();
      if (workshopId) {
         const redirect = await redirectToCorrectWorkshopPage(workshopId, RedirectToCorrectWorkshopPageEnum.RESULT);
         if (redirect) {
            return redirect;
         }
      }
      return {
         props: {},
      };
   },
});

export default WorkshopResult;