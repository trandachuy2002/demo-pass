'use client'
import { useDialogStore } from '@/store/dialogStores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { DialogCustom } from '../dialog/DialogCustom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStores';
import useCookieStore from '@/store/useCookieStore';
import AlertDialogCustom from '../alert/AlertDialogCustom';
import { useAlertDialogStore } from '@/store/useAlertDialogStore';
const LayoutRoot = dynamic(() => import("@/components/layout/LayoutRoot"), { ssr: false });

const LayoutContainer = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
    const queryClient = new QueryClient()

    const { getCookie } = useCookieStore()

    const { informationUser } = useAuthStore()

    const { openAlertDialog } = useAlertDialogStore()

    const { openDialogCustom, setOpenDialogCustom } = useDialogStore()

    useEffect(() => {
        if (!informationUser && !getCookie()) {
            setOpenDialogCustom(true)
        }
    }, [informationUser, openAlertDialog])
    return (
        <LayoutRoot>
            <Toaster position="top-right" reverseOrder={false} />
            <QueryClientProvider client={queryClient}>
                {children}
                {openDialogCustom && <DialogCustom />}
                {openAlertDialog && <AlertDialogCustom />}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </LayoutRoot>
    )
}

export default LayoutContainer
