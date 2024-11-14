"use client";
import Cookies from "js-cookie";
import { KEY_COOKIES } from "@/constants/Cookie";

const useCookieStore = () => {
    const setCookie = (key: string = KEY_COOKIES.WEBSITE, value: string, options?: Cookies.CookieAttributes) => {
        Cookies.set(key, value, options);
    };

    const removeCookie = (key: string = KEY_COOKIES.WEBSITE, options?: Cookies.CookieAttributes) => {
        Cookies.remove(key, options);
    };

    const getCookie = (key: string = KEY_COOKIES.WEBSITE) => {
        return Cookies.get(key);
    };

    return { setCookie, removeCookie, getCookie };
};

export default useCookieStore;
