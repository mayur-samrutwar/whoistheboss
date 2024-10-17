import "@/styles/globals.css";
import ContextProvider from '@/context';
import Layout from '@/components/layout';

export default function App({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ContextProvider>
  );
}
