'use client'

import dynamic from "next/dynamic";
const Wallet = dynamic(() => import("@/components/wallet/Wallet"), { ssr: false });
const HomePage = (props: any) => {
  return (
    <div className='flex flex-col gap-2 h-screen justify-center items-center bg-gray-50'>
      <Wallet />
    </div>
  );
};

export default HomePage;