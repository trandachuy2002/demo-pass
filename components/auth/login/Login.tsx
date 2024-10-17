'use client'

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useAuthLoginRegister } from '@/hooks/auth/useAuthLoginRegister';
import { useShowHiddenPassword } from '@/hooks/auth/useShowPassword';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from "react-hook-form";
const Login = () => {
    const form = useForm({
        defaultValues: {
            name: '',
            password: ""
        }
    })

    const { onSubmit, isLoading } = useAuthLoginRegister()

    const { showPassword, togglePasswordVisibility } = useShowHiddenPassword()

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => {
                    onSubmit(values, 'login')
                })}
                className="space-y-4"
            >
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        rules={{
                            required: "Vui lòng nhập tài khoản!",
                        }}
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-black dark:text-secondary/70">
                                    Tài khoản <span className="text-[#F15A5A] text-sm">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            // className="bg-white rounded-none border-b border-x-0 border-t-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            className={`${fieldState?.invalid && fieldState?.error
                                                ? "border rounded-lg border-[#F15A5A]"
                                                : "border-b border-x-0 border-t-0 rounded-none"
                                                } bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0`}
                                            placeholder="Nhập tài khoản"
                                            type={"text"}
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                {fieldState?.invalid && fieldState?.error && (
                                    <FormMessage>{fieldState?.error?.message}</FormMessage>
                                )}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        rules={{
                            required: "Vui lòng nhập mật khẩu!",
                        }}
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-black dark:text-secondary/70">
                                    Mật khẩu <span className="text-[#F15A5A] text-sm">*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            // className="bg-white rounded-none border-b border-x-0 border-t-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            className={`${fieldState?.invalid && fieldState?.error
                                                ? "border rounded-lg border-[#F15A5A]"
                                                : "border-b border-x-0 border-t-0 rounded-none"
                                                } bg-white focus-visible:ring-0 text-black focus-visible:ring-offset-0`}
                                            placeholder="Nhập mật khẩu"
                                            type={showPassword ? "text" : "password"}
                                            {...field}
                                        />
                                        {showPassword ? (
                                            <Eye
                                                onClick={() => togglePasswordVisibility("password")}
                                                className="absolute top-[25%] right-1 w-5 h-5 cursor-pointer"
                                            />
                                        ) : (
                                            <EyeOff
                                                onClick={() => togglePasswordVisibility("password")}
                                                className="absolute top-[25%] right-1 w-5 h-5 cursor-pointer"
                                            />
                                        )}
                                    </div>
                                </FormControl>
                                {fieldState?.invalid && fieldState?.error && (
                                    <FormMessage>{fieldState?.error?.message}</FormMessage>
                                )}
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter>
                    <Button
                        // disabled={isLoading}
                        type="submit"
                        className={cn(
                            "capitalize rounded-3xl 3xl:text-sm bg-blue-500 hover:bg-blue-500/80 text-white"
                        )}
                    >
                        Đăng nhập
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}

export default Login
