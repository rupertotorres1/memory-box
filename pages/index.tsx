import React from "react";
import Head from "next/head";
import Memories from "../components/Memories";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Memories />
    </div>
  );
};

export default Home;
