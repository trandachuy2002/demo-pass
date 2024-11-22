import httpClient from "@/utils/axios/axios-customize";
const url = process.env.NEXT_PUBLIC_URL_API_BACKEND;
const urlPaasBworks = process.env.NEXT_PUBLIC_URL_API_PAAS_BWORKS;
const apiWallet = {
    async getCampaign(id: string): Promise<any> {
        return await httpClient.get(`${url}/api_affiso/get_campaign/${id}`);
    },
    async postCreateLock(id: string, data: FormData): Promise<any> {
        return await httpClient.post(`${url}/api_affiso/create_lock/${id}`, data);
    },
    async postCreateListLock(data: FormData): Promise<any> {
        return await httpClient.post(`${url}/api_affiso/create_list_lock`, data);
    },
    async getCampaignListUnlock(id: string): Promise<any> {
        return await httpClient.get(`${url}/api_affiso/get_campaign_unlock/${id}`);
    },
    async getCampaignUnlock(id: string): Promise<any> {
        return await httpClient.get(`${url}/api_affiso/get_campaign_unlock/${id}`);
    },

    async postUnLock(id: string, data: FormData): Promise<any> {
        return await httpClient.post(`${url}/api_affiso/create_unlock/${id}`, data);
    },
    async postListUnLock(data: FormData): Promise<any> {
        return await httpClient.post(`${url}/api_affiso/create_list_unlock`, data);
    },
    parseAddress: (data: any) => {
        return httpClient.post(`${urlPaasBworks}/api/wallets/parseAddress`, data);
    },
    plutustxs: (data: any) => {
        return httpClient.post(`${urlPaasBworks}/api/plutustxs`, data);
    },
    unlockPlutustxs: (data: any, params: string) => {
        return httpClient.put(`${urlPaasBworks}/api/plutustxs/unlock/${params}`, data);
    },
    findutxo: (scriptAddress: any, lockedTxHash: any) => {
        const filter = `{\"scriptAddress\":\"${scriptAddress}\",\"asset\":\"lovelace\",\"lockedTxHash\":\"${lockedTxHash}\"}`;

        return httpClient.get(`${urlPaasBworks}/api/public/findutxo?filter=${encodeURI(filter)}\n`);
    },
    contracts: (id: any) => {
        return httpClient.get(`${urlPaasBworks}/api/contracts/${id}`);
    },
};
export default apiWallet;
