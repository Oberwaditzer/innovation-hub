import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Link from 'next/link';

const Dashboard = () => {
   return (
      <Link href={'/workshop/ckzd563vz00023e6cyh70f1tt/start'}>
         Go To Worksohp
      </Link>
   );
};

export const getServerSideProps = withPageAuthRequired();

export default Dashboard;
