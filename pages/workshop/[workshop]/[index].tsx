import React, { useContext, useEffect } from 'react';
import { WorkshopModuleDefinitions } from '../../../definitions/WorkshopModuleTypes';
import { WorkshopSidebar } from '../../../frontend/components/workshop/Sidebar/Sidebar';
import { WorkshopTitle } from '../../../frontend/components/workshop/components/Title';
import { WorkshopContext } from '../../../frontend/context/WorkshopContext';
import { useTimer } from '../../../frontend/hooks/useTimer';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { WorkshopBlocker } from '../../../frontend/components/workshop/components/WorkshopBlocker';
import { useRecoilValue } from 'recoil';
import { workshopModule } from '../../../frontend/state/atoms/workshop';
import {
   redirectToCorrectWorkshopPage,
   RedirectToCorrectWorkshopPageEnum,
} from '../../../backend/Routing/WorkshopRouting';

const WorkshopRenderer = () => {
   const context = useContext(WorkshopContext);
   const module = useRecoilValue(workshopModule);
   useTimer();
   const { user } = useUser();

   useEffect(() => {
      if (user) context.connect();
   }, [context, user?.email]);
   if (!module) {
      return null;
   }
   const ModuleComponent = WorkshopModuleDefinitions.find(e => e.key === module!.type)!.component;
   return (
      <div className={'h-screen w-screen flex flex-initial flex-row'}>
         <WorkshopBlocker />
         <WorkshopSidebar />
         <div className={'w-full h-full flex flex-col items-center p-10'}>
            <WorkshopTitle />
            <ModuleComponent />
         </div>

      </div>
   );
};

export const getServerSideProps = withPageAuthRequired({
   returnTo: '/',
   async getServerSideProps(context) {
      const workshopId = context.query.workshop?.toString();
      if (workshopId) {
         const redirect = await redirectToCorrectWorkshopPage(workshopId, RedirectToCorrectWorkshopPageEnum.INDEX);
         if (redirect) {
            return redirect;
         }
      }
      return {
         props: {},
      };
   },
});


export default WorkshopRenderer;
