'use client'
import { MeshProvider } from '@meshsdk/react';
import "@meshsdk/react/styles.css";
import React from 'react';


const LayoutRoot = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <MeshProvider>
            {children}
        </MeshProvider>
    )
}

export default LayoutRoot
