import React from 'react';
import Head from 'next/Head';
import Achievements from '../components/Achievements';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Achievements />
    </div>
  );
};

export default Home;
