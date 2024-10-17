import httpClient from "@/utils/axios/axios-customize";
const apiWallet = {
    parseAddress: (data: any) => {
        return httpClient.post("/api/wallets/parseAddress", data);
    },
    plutustxs: (data: any) => {
        return httpClient.post("/api/plutustxs", data);
    },
    unlockPlutustxs: (data: any, params: string) => {
        return httpClient.put(`/api/plutustxs/unlock/${params}`, data);
    },
    findutxo: (scriptAddress: any, lockedTxHash: any) => {
        const filter = `{\"scriptAddress\":\"${scriptAddress}\",\"asset\":\"lovelace\",\"lockedTxHash\":\"${lockedTxHash}\"}`;

        return httpClient.get(`/api/public/findutxo?filter=${encodeURI(filter)}\n`);
    },
    contracts: (id: any) => {
        return httpClient.get(`/api/contracts/${id}`);
    },
};
export default apiWallet;
