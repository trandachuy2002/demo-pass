import { create } from "zustand";

interface IAuthState {
    otp: number;
    setOtp: (key: number) => void;
    form: any;
    setForm: (key: any) => void;
}

export const useAuthState = create<IAuthState>((set) => ({
    otp: 0,
    form: {},
    setOtp: (key: number) => set((state) => ({ otp: key })),
    setTimeOtp: (time: number) => set({ otp: time }),
    setForm: (key: any) => set((state) => ({ form: key })),
}));

interface IAuthStore {
    informationUser?: any;
    setInformationUser: (key?: any) => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
    informationUser: undefined,
    setInformationUser: (key?: any) => set((state) => ({ informationUser: key })),
}));
