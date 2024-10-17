import { create } from "zustand";

export const useDialogStore = create<any>((set) => ({
    openDialogCustom: false,
    statusDialog: "",
    setStatusDialog: (type: string) => set((state: any) => ({ statusDialog: type })),
    setOpenDialogCustom: (key: boolean) => set((state: any) => ({ openDialogCustom: key })),
}));
