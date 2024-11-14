import httpClient from "@/utils/axios/axios-customize";
const url = process.env.NEXT_PUBLIC_URL_API_BACKEND;
const urlPaasBworks = process.env.NEXT_PUBLIC_URL_API_PAAS_BWORKS;
const apiAuth = {
    postLoginDefault: (data: any) => {
        return httpClient.post(`${urlPaasBworks}/api/auth/login`, data);
    },
};
export default apiAuth;
