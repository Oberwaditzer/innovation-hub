import React, { useContext, useEffect } from 'react';
import { Button } from '../../../frontend/components/button/Button';
import { WorkshopContext } from '../../../frontend/context/WorkshopContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Spinner } from '../../../frontend/components/spinner/Spinner';
import { WorkshopSocketEvents } from '../../../definitions/WorkshopSocketEvents';
import { useRecoilState, useRecoilValue } from 'recoil';
import { sortedWorkshopUsers, workshopState } from '../../../frontend/state/atoms/workshop';
import { UserItem } from '../../../frontend/components/workshop/components/UserItem';
import { getWorkshopInResults, getWorkshopStep } from '../../../backend/workshop/RedisAdapter';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { ParsedUrlQuery } from 'querystring';
import {
   redirectToCorrectWorkshopPage,
   RedirectToCorrectWorkshopPageEnum,
} from '../../../backend/Routing/WorkshopRouting';
import { userState } from '../../../frontend/state/atoms/user';

type StartProps = {
   translations: {
      workshop: {
         start: {
            header: string;
            button: string;
         };
      };
   };
   workshopId: string;
};

const Start = ({ translations, workshopId }: StartProps) => {
   const context = useContext(WorkshopContext);
   const onlineUsers = useRecoilValue(sortedWorkshopUsers);
   const workshop = useRecoilValue(workshopState);
   const personalUserState = useRecoilValue(userState);
   const { user } = useUser();

   useEffect(() => {
      if (user) context.connect();
   }, [context, user?.email]);
   const onClick = () => {
      context.sendData(WorkshopSocketEvents.WorkshopModuleNext, {});
   };

   return (
      <div
         className={
            'flex basis-auto flex-1 justify-center items-center flex-grow h-screen w-screen'
         }
      >
         <div
            className={
               'flex basis-auto flex-initial flex-col justify-center items-center rounded-3xl'
            }
         >
            <p className={'text-xl tracking-wide font-thin'}>
               {translations.workshop.start.header}
            </p>
            <p className={'text-3xl font-bold mt-4'}>{workshop?.name}</p>
            <div className={'my-14 w-full'}>
               {onlineUsers &&
                  onlineUsers.map((user, index) => (
                     <UserItem key={user.id} user={user} />
                  ))}
            </div>
            {!context.connected && <Spinner />}
            {context.connected && <p>Waiting for your faciliator...</p>}
            {personalUserState.isFacilitator && <Button onClick={onClick} text={'Start Workshop'} />}
         </div>
      </div>
   );
};

type GetServerSidePropsContextWithLocale = ParsedUrlQuery & {
   locale: string;
   query: {
      workshop?: string;
   };
};

export const getServerSideProps = withPageAuthRequired<any,
   GetServerSidePropsContextWithLocale>({
   returnTo: '/',
   async getServerSideProps(context) {
      const workshopId = context.query.workshop as string;
      const redirect = await redirectToCorrectWorkshopPage(workshopId, RedirectToCorrectWorkshopPageEnum.START);
      console.log('redirect', redirect);
      if (redirect) {
         return redirect;
      }
      const translations = (await serverSideTranslations(context.locale!))
         ._nextI18Next.initialI18nStore[context.locale!].common;
      // if (workshopId !== 'id') {
      //     return {
      //         redirect: {
      //             destination: '/',
      //             permanent: false
      //         }
      //     }
      // }
      return {
         props: {
            translations: {
               ...translations,
            },
            workshopId: workshopId,
            // Will be passed to the page component as props
         },
      };
   },
});


export default Start;
