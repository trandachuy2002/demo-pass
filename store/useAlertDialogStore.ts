import { create } from "zustand";

interface IOpenAlertDialog {
    openAlertDialog: boolean;
    type?: string;
    setOpenAlertDialog: (key: any, type?: string) => void;
}

export const useAlertDialogStore = create<IOpenAlertDialog>((set) => ({
    openAlertDialog: false,
    type: "",
    setOpenAlertDialog: (key: any, type?: string) => set((state) => ({ openAlertDialog: key, type: type })),
}));
