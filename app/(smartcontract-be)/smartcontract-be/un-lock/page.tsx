'use client'
import dynamic from 'next/dynamic'
import React from 'react'
const UnLock = dynamic(() => import("@/components/wallet/smartContractionBe/UnLock"), { ssr: false });

const Page = () => {
    return (
        <div>
            <UnLock />
        </div>
    )
}

export default Page