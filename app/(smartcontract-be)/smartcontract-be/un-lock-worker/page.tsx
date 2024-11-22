'use client'
import dynamic from 'next/dynamic'
import React from 'react'
const UnLockWorkerPopup = dynamic(() => import("@/components/wallet/smartContractionBe/UnLockWorker"), { ssr: false });

const UnLockWorker = () => {
    return (
        <div className=''>
            <UnLockWorkerPopup />
        </div>
    )
}

export default UnLockWorker