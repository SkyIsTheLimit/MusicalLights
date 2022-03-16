import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <div className='bg-neutral-900 text-neutral-300 py-8 mb-8'>
        <h1 className='text-2xl text-center font-bold'>Musical Lights</h1>
      </div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
