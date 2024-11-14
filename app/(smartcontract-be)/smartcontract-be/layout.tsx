'use client'
import dynamic from "next/dynamic";
import React from "react";


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            {children}
        </div>
    )

}
