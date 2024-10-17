import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useDialogStore } from "@/store/dialogStores";
import { useEffect, useState } from "react";
import Login from "../auth/login/Login";

type Props = {};

export function DialogCustom({ }: Props) {
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const { openDialogCustom, statusDialog, setOpenDialogCustom } = useDialogStore()

    const handleCloseDialog = (value: boolean) => {
        setOpenDialogCustom(true)
    }


    if (!isMounted) {
        return null;
    }

    return (
        <Dialog
            modal
            open={openDialogCustom}
            onOpenChange={(value: boolean) => handleCloseDialog(value)}
        >
            <DialogOverlay className="bg-[#161515]/50" onClick={() => { handleCloseDialog(true) }} />
            {
                <DialogContent className="border-gradient-auth h-fit p-6 pr-3 rounded-3xl">
                    <div className="mb-8">
                        {/* <DialogClose
                            onClick={() => setOpenDialogCustom(false)}
                            className="size-8 border z-20 flex items-center justify-center p-2 rounded-full absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 
                            disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="size-4" />
                            <span className="sr-only">Close</span>
                        </DialogClose> */}
                        <DialogHeader className="flex items-center justify-center w-full">
                            <DialogTitle className={`capitalize 2xl:text-[32px] text-2xl font-semibold`}>
                                Đăng nhập
                            </DialogTitle>
                        </DialogHeader>
                    </div>
                    <ScrollArea
                        type="hover"
                        className={`3xl:max-h-[640px] max-h-[480px] overflow-y-auto pr-3 z-20`}
                    >
                        <Login />
                    </ScrollArea>
                </DialogContent>
            }

        </Dialog >
    );
}
