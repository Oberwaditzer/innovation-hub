import React, { useContext, useEffect } from 'react';
import { WorkshopContext } from '../../../frontend/context/WorkshopContext';
import { useRecoilValue } from 'recoil';
import { modulePreviousUserData, workshopModule } from '../../../frontend/state/atoms/workshop';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { WorkshopBlocker } from '../../../frontend/components/workshop/components/WorkshopBlocker';
import { WorkshopSidebar } from '../../../frontend/components/workshop/sidebar/Sidebar';
import { WorkshopTitle } from '../../../frontend/components/workshop/components/Title';
import {
   redirectToCorrectWorkshopPage,
   RedirectToCorrectWorkshopPageEnum,
} from '../../../backend/Routing/WorkshopRouting';

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
            {JSON.stringify(previousData)}
         </div>

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