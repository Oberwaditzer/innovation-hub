import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { WorkshopContextProvider } from '../frontend/context/WorkshopContext';
import { appWithTranslation } from 'next-i18next';

function BestAppInTheWorld({ Component, pageProps }: AppProps) {
   return (
      <RecoilRoot>
         <WorkshopContextProvider>
            <Component {...pageProps} />
         </WorkshopContextProvider>
      </RecoilRoot>
   );
}

export default appWithTranslation(BestAppInTheWorld);
