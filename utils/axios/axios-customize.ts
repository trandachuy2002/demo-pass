import { KEY_COOKIES } from "@/constants/Cookie";
import { CookieCore } from "@/lib/cookie";
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
const baseUrl = process.env.NEXT_PUBLIC_URL_API_BACKEND;

export const checkPathName = () => {
    if (typeof window !== "undefined") {
        const pathname = window.location.pathname ?? "";
        return pathname.startsWith("/smartcontract-be");
    }
};

const httpClient: AxiosInstance = axios.create({
    baseURL: checkPathName() ? "" : baseUrl,
    withCredentials: false,
    params: {},
});

interface ErrorResponseData {
    message?: string;
    code?: number;
    result?: any;
}

const handleError = (error: AxiosError): Promise<never> => {
    const status = error.response?.status || 500;
    const data = error.response?.data as ErrorResponseData;
    const errorMessage = data?.message || "An unexpected error occurred";
    switch (status) {
        case 401:
        case 403:
        case 400:
        case 404:
        case 409:
        case 422:
            return Promise.reject(error);
        default:
            return Promise.reject(new Error(errorMessage));
    }
};

// Request interceptor để thêm header Authorization nếu có token
httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (checkPathName()) {
            if (CookieCore.get(KEY_COOKIES.WEBSITE_PAAS_BWORKS) !== undefined) {
                config.headers.Authorization = `Bearer ${CookieCore.get(KEY_COOKIES.WEBSITE_PAAS_BWORKS)}`;
            }
        } else {
            if (CookieCore.get(KEY_COOKIES.WEBSITE) !== undefined) {
                config.headers.Authorization = `Bearer ${CookieCore.get(KEY_COOKIES.WEBSITE)}`;
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor để xử lý lỗi
httpClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => handleError(error)
);

export default httpClient;
