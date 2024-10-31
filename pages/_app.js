import "@/styles/globals.css";
import ContextProvider from '@/context';
import RootLayout from '@/components/layout/RootLayout';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ContextProvider>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </ContextProvider>
    </SessionProvider>
  );
}
