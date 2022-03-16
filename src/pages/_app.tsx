import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <div className='bg-neutral-900 dark:bg-black text-neutral-300 dark:text-white py-8 mb-8'>
        <h1 className='text-4xl text-center font-light'>Musical Lights</h1>
      </div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
