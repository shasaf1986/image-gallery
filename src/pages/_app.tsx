import React, { FC, useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import App from '../components/app';

const NextApp: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <>
      <Head>
        <title>Image Gallery</title>
      </Head>
      <App>
        <Component {...pageProps} />
      </App>
    </>
  );
};

export default NextApp;
