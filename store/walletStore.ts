import { create } from "zustand";

interface IAddress {
    address: string;
    pKeyHash: string;
    pKeyHashBech32: string;
}

interface IWalletStore {
    dataAddress: IAddress;
    validateMessage: string | null;
    setValidateMessage: (mssg: string | null) => void;
    setDataAddress: (dataAddress: any) => void;
}

export const useWalletStore = create<IWalletStore>((set) => ({
    dataAddress: {
        address: "",
        pKeyHash: "",
        pKeyHashBech32: "",
    },
    validateMessage: null,
    setDataAddress: (data: IAddress) => set((state: any) => ({ dataAddress: data })),
    setValidateMessage: (data: string | null) => set((state: any) => ({ validateMessage: data })),
}));
