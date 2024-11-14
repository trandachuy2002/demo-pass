import { toastCore } from "@/lib/toast";
import apiWallet from "@/services/wallet/wallet.services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
export const useGetCampaignBeLock = (id: string) => {
    return useQuery({
        queryKey: ["getCampaignBe"],
        queryFn: async () => {
            try {
                const { data } = await apiWallet.getCampaign(id);
                if (!data?.result) {
                    toastCore.error(data?.message);
                    return data;
                }

                return data?.data;
            } catch (err) {}
        },
        placeholderData: keepPreviousData,
        retry: 3,
        gcTime: 5000,
        retryDelay: 1000,
        enabled: !!id,
    });
};

export const useGetCampaignBeUnLock = (id: string) => {
    return useQuery({
        queryKey: ["getCampaignBeUnLock"],
        queryFn: async () => {
            try {
                const { data } = await apiWallet.getCampaignUnlock(id);
                if (!data?.result) {
                    toastCore.error(data?.message);
                    return data;
                }

                return data?.data;
            } catch (err) {}
        },
        placeholderData: keepPreviousData,
        retry: 3,
        gcTime: 5000,
        retryDelay: 1000,
        enabled: !!id,
    });
};
