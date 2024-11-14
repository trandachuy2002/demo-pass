'use client'
import dynamic from 'next/dynamic';
import React from 'react'
const Lock = dynamic(() => import("@/components/wallet/smartContractionBe/Lock"), { ssr: false });
const Page = () => {
    return (
        <div>
            <Lock />
        </div>
    )
}

export default Page