import { AxiosRequestConfig } from "axios";

const createAxiosRequestConfig = <T>(params?: T): AxiosRequestConfig<T> => {
    return {
        params,
    };
};

export default createAxiosRequestConfig;
