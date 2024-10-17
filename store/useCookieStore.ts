"use client";

import Cookies from "js-cookie";
interface IUseCookie {
    key: "token_p" | string;
    initialValue?: string;
}

const useCookieStore = (key: IUseCookie["key"] = "token_p", initialValue?: IUseCookie["initialValue"]) => {
    const setCookie = (value: string, options?: Cookies.CookieAttributes) => {
        Cookies.set(key, value, options);
    };

    const removeCookie = (key: IUseCookie["key"] = "token_p", options?: Cookies.CookieAttributes) => {
        Cookies.remove(key, options);
    };

    const getCookie = () => {
        return Cookies.get(key);
    };

    return { setCookie, removeCookie, getCookie };
};

export default useCookieStore;
