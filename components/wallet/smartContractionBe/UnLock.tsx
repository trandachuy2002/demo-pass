"use client";

import ButtonLoading from "@/components/button/ButtonLoading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthLoginRegisterBe } from "@/hooks/wallet/smartcontract-be/useAuthBe";
import { useGetCampaignBeUnLock } from "@/hooks/wallet/smartcontract-be/useGetCampaignBe";
import { useWalletParseAddressBe } from "@/hooks/wallet/smartcontract-be/useWalletParseAddressBe";
import { useWalletTransactionBe } from "@/hooks/wallet/smartcontract-be/useWalletTransactionBe";
import useCookieStore from "@/store/useCookieStore";
import { CardanoWallet, useAddress, useWallet } from '@meshsdk/react';
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

declare const LANGUAGE_VERSIONS: {
    V1: string;
    V2: string;
    V3: string;
};

type LanguageVersion = keyof typeof LANGUAGE_VERSIONS;

type PlutusScript = {
    version: LanguageVersion;
    code: string;
};

const dataType = [
    {
        value: 1,
        label: 'String'
    },
    {
        value: 2,
        label: 'Number'
    },
    {
        value: 3,
        label: 'Date'
    }
]

const defaulValues = {
    createContract: {
        auditName: '',
        amount: "",
    },
    closingTheContract: {
        lockedTxHash: "",
        reCeiveAddress: "",
        keyReceiveMoney: ""
    },
    datum: [
        {
            type: "",
            value: ""
        }
    ]
}

const UnLock = () => {
    const formatContract = (contract: any): PlutusScript => {
        return {
            code: contract?.cborHex,
            version: contract?.type === "PlutusScriptV1" ? "V1" : "V2",
        };
    };

    const address = useAddress()

    const { connected, connect, wallet } = useWallet();

    const { getCookie } = useCookieStore()

    const getParams = useSearchParams()

    const id = getParams.get('id') ?? ""

    const form = useForm({ defaultValues: defaulValues })

    const { onSubmit } = useAuthLoginRegisterBe()

    const { onParseAddress } = useWalletParseAddressBe()

    const { data: dataCampaignBeUnLock } = useGetCampaignBeUnLock(id)

    const { unlockFunction, getContract, getUtxo, contract, setPlutusScript, isLoading } = useWalletTransactionBe()

    useEffect(() => {
        onSubmit({ name: "thuannguyen.fososoft@gmail.com", password: "Foso@2024" }, "login")
    }, [])

    useEffect(() => {
        if (address) {
            onParseAddress(address)
        }
    }, [address])

    useEffect(() => {
        if (dataCampaignBeUnLock?.result) {
            console.log("dataCampaignBeUnLock", dataCampaignBeUnLock);

            form.setValue("closingTheContract.lockedTxHash", dataCampaignBeUnLock?.id_lock)
            // form.setValue("closingTheContract.reCeiveAddress", dataCampaignBeUnLock?.address_smart_contract)
            if (!connected) return
            getContract();
            getUtxo(dataCampaignBeUnLock?.id_lock)
        }
    }, [dataCampaignBeUnLock, connected])

    useEffect(() => {
        if (contract) setPlutusScript(formatContract(contract.contract));
    }, [contract]);

    return (
        <div className="flex flex-col gap-6 justify-between items-center  max-w-[450px] min-w-[450px] bg-white dark:bg-[#242B4280] dark:shadow-none shadow-[0px_0px_120px_16px_#979FB71A]py-6 md:px-8 px-6 rounded-[12px]  w-full p-5">
            <h1 className={'w-full text-start text-base text-black dark:text-white font-medium'}>Unlock smart contract</h1>
            <div className="flex items-center justify-start w-full gap-4">
                <CardanoWallet />
                <div className="flex flex-col gap-1">
                    <h1 className="cursor-pointer font-semibold text-black dark:text-white">
                        {getCookie("username") ?? ""}
                    </h1>
                </div>
            </div>
            <div className={'flex flex-col gap-2 w-full'}>
                <Form {...form}>
                    <div className="grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="closingTheContract.lockedTxHash"
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Required locked Tx hash!',
                                },
                            }}
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem className="col-span-1">
                                        <FormLabel className="2xl:text-sm lg:text-xs font-semibold tracking-wider">
                                            Locked Tx hash <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl >
                                            <div
                                                className={`w-full min-h-11 truncate line-clamp-1 block cursor-default text-black dark:text-white disabled:text-black disabled:opacity-100 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
                                            >
                                                {field.value}
                                            </div>
                                        </FormControl>

                                        {
                                            fieldState?.invalid && fieldState?.error && (
                                                <FormMessage>{fieldState?.error?.message}</FormMessage>)
                                        }
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="closingTheContract.reCeiveAddress"
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Required receive wallet address!',
                                },
                            }}
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem className="col-span-1">
                                        <FormLabel className="2xl:text-sm lg:text-xs font-semibold tracking-wider text-black dark:text-white">
                                            Receive wallet address <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className={`w-full h-auto min-h-11 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border border-transparent rounded-[8px] dark:bg-[#040B24] border-[#272727] 
                                                    dark:border-[#394456] dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
                                                placeholder="Receive Address"
                                                {...field}
                                            />

                                        </FormControl>
                                        {
                                            fieldState?.invalid && fieldState?.error && (
                                                <FormMessage>{fieldState?.error?.message}</FormMessage>)
                                        }
                                    </FormItem>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="closingTheContract.keyReceiveMoney"
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Required key receive money!',
                                },
                            }}
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="2xl:text-sm lg:text-xs font-semibold tracking-wider text-black dark:text-white">
                                            Key Datum Receive Money <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className={`w-full h-auto min-h-11 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border border-transparent rounded-[8px] dark:bg-[#040B24] border-[#272727] 
                                                    dark:border-[#394456] dark:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
                                                placeholder="Key Datum Receive Money"
                                                {...field}
                                            />
                                        </FormControl>
                                        {
                                            fieldState?.invalid && fieldState?.error && (
                                                <FormMessage>{fieldState?.error?.message}</FormMessage>)
                                        }
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                    <div className="flex justify-end w-full">
                        <ButtonLoading
                            disabled={isLoading}
                            isStateloading={isLoading}
                            onClick={form.handleSubmit((data) => {
                                unlockFunction({ ...data, id_lock: dataCampaignBeUnLock?.id_lock, list_key: dataCampaignBeUnLock?.list_key, money_ada: dataCampaignBeUnLock?.expense });
                            })}
                            title="Submit"
                            type='submit'
                            className='py-[13px] 2xl:text-lg text-base px-4 w-full dark:text-white h-auto bg-[#3276FA] hover:bg-[#3276FA]/80 rounded-xl'
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default UnLock