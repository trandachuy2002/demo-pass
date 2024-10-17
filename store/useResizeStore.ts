import { create } from "zustand";

// resize responsive
interface ResizeStore {
    isVisibleMobile: boolean;
    isVisibleTablet: boolean;
    isVisibleMacbookSmall: boolean;
    onResizeMobile: () => void;
    onResizeTablet: () => void;
    onResizeMacbookSmall: () => void;
    onCloseResizeMobile: () => void;
    onCloseResizeTablet: () => void;
    onCloseResizeMacbookSmall: () => void;
}

export const useResizeStore = create<ResizeStore>((set) => ({
    isVisibleMobile: false,
    isVisibleTablet: false,
    isVisibleMacbookSmall: false,
    onResizeMobile: () => set({ isVisibleMobile: true }),
    onResizeTablet: () => set({ isVisibleTablet: true }),
    onResizeMacbookSmall: () => set({ isVisibleMacbookSmall: true }),
    onCloseResizeMobile: () => set({ isVisibleMobile: false }),
    onCloseResizeTablet: () => set({ isVisibleTablet: false }),
    onCloseResizeMacbookSmall: () => set({ isVisibleMacbookSmall: false }),
}));
