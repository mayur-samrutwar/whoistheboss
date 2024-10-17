import "@/styles/globals.css";
import { headers } from "next/headers";
import ContextProvider from '@/context';

export default function App({ Component, pageProps }) {
  const cookies = headers().get('cookie');

  return (
    <ContextProvider cookies={cookies}>
      <Component {...pageProps} />
    </ContextProvider>
  );
}
