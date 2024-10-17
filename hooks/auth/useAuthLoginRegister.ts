import { CookieCore } from "@/lib/cookie";
import { toastCore } from "@/lib/toast";
import apiAuth from "@/services/auth/auth.services";
import { useAuthStore } from "@/store/authStores";
import { useDialogStore } from "@/store/dialogStores";
import useCookieStore from "@/store/useCookieStore";
import { useMutation } from "@tanstack/react-query";

export const useAuthLoginRegister = () => {
    const { setCookie } = useCookieStore();
    const { setInformationUser } = useAuthStore();
    const { setOpenDialogCustom } = useDialogStore();

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
                            setCookie(res?.accessToken);
                            setInformationUser(res);
                            setOpenDialogCustom(false);
                            CookieCore.set("username", res?.fullName);
                            toastCore.success("Đăng nhập thành công");
                            return;
                        }
                    },
                    onError: (error: any) => {
                        toastCore.error(error?.response?.data?.message);
                    },
                }
            );
        }
    };

    return { onSubmit, isLoading: loginMutation.isPending };
};
