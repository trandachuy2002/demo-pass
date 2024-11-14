import { KEY_COOKIES } from "@/constants/Cookie";
import { CookieCore } from "@/lib/cookie";
import { toastCore } from "@/lib/toast";
import apiAuth from "@/services/auth/auth.services";
import useCookieStore from "@/store/useCookieStore";
import { useMutation } from "@tanstack/react-query";

export const useAuthLoginRegisterBe = () => {
    const { setCookie } = useCookieStore();

    const loginMutation = useMutation({
        mutationFn: async (data: any) => {
            const { data: res } = await apiAuth.postLoginDefault(data);
            return res;
        },
    });

    const onSubmit = async (data: any, type: string) => {
        if (type == "login") {
            loginMutation.mutate(
                {
                    username: data.name,
                    password: data.password,
                },
                {
                    onSuccess: (res) => {
                        if (res) {
                            setCookie(KEY_COOKIES.WEBSITE_PAAS_BWORKS, res?.accessToken);
                            CookieCore.set("username", res?.fullName);
                            // toastCore.success("Đăng nhập thành công");
                            return;
                        }
                    },
                    onError: (error: any) => {
                        // toastCore.error(error?.response?.data?.message);
                    },
                }
            );
        }
    };

    return { onSubmit, isLoading: loginMutation.isPending };
};
