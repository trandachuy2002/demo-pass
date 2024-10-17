import httpClient from "@/utils/axios/axios-customize";
const apiAuth = {
    postLoginDefault: (data: any) => {
        return httpClient.post("/api/auth/login", data);
    },
};
export default apiAuth;
