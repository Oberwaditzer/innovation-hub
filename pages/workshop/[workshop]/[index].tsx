import React, { useContext, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { WorkshopModuleDefinitions } from '../../../definitions/WorkshopModuleTypes';
import { WorkshopSidebar } from '../../../frontend/components/workshop/sidebar/Sidebar';
import { BrainstormingModule } from '../../../frontend/components/workshop/modules/Brainstorming/BrainstormingModule';
import { WorkshopTitle } from '../../../frontend/components/workshop/components/Title';
import { WorkshopContext } from '../../../frontend/context/WorkshopContext';
import { getWorkshopStep } from '../../../backend/workshop/RedisAdapter';

type WorkshopRendererProps = {
   type: string;
};

const WorkshopRenderer = ({ type }: WorkshopRendererProps) => {
   const context = useContext(WorkshopContext);
   useEffect(() => {
      context.connect();
   }, [context]);
   return (
      <div className={'h-screen w-screen flex flex-initial flex-row'}>
         <WorkshopSidebar />
         <div
            className={
               'w-full h-full flex flex-col items-center pt-10 pr-10 pb-10'
            }
         >
            <WorkshopTitle />
            <BrainstormingModule />
         </div>
         {/*{WorkshopModuleDefinitions.find(e=>e.key === type)!.component()}*/}
      </div>
   );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
   const workshop = context.query.workshop?.toString();
   if (workshop) {
      const isWorkshopRunning = await getWorkshopStep(workshop);
      if (!isWorkshopRunning) {
         return {
            redirect: {
               permanent: false,
               destination: `/workshop/${workshop}/start`,
            },
         };
      }
   }

   return {
      props: {
         type: WorkshopModuleDefinitions[0].key,
      },
   };
}

export default WorkshopRenderer;
