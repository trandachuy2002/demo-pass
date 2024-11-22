'use client'
import { MeshProvider } from '@meshsdk/react';
import "@meshsdk/react/styles.css";
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { KEY_COOKIES } from '@/constants/Cookie';


const LayoutRoot = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <MeshProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                themes={KEY_COOKIES.THEME}
                enableSystem={false}
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </MeshProvider>
    )
}

export default LayoutRoot
