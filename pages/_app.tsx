import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { WorkshopContextProvider } from '../frontend/context/WorkshopContext';
import { appWithTranslation } from 'next-i18next';
import { UserProvider } from '@auth0/nextjs-auth0';

function BestAppInTheWorld({ Component, pageProps }: AppProps) {
   return (
      <UserProvider>
         <RecoilRoot>
            <WorkshopContextProvider>
               <Component {...pageProps} />
            </WorkshopContextProvider>
         </RecoilRoot>
      </UserProvider>
   );
}

export default appWithTranslation(BestAppInTheWorld);
