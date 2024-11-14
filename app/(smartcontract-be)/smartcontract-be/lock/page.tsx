"use client";

import ButtonLoading from "@/components/button/ButtonLoading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuthLoginRegisterBe } from "@/hooks/wallet/smartcontract-be/useAuthBe";
import { useGetCampaignBeLock } from "@/hooks/wallet/smartcontract-be/useGetCampaignBe";
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
        reCeiveAddress: ""
    },
    datum: [
        {
            type: "",
            value: ""
        }
    ]
}
const formatContract = (contract: any): PlutusScript => {
    return {
        code: contract?.cborHex,
        version: contract?.type === "PlutusScriptV1" ? "V1" : "V2",
    };
};

const Lock = () => {
    const address = useAddress()

    const { connected } = useWallet();

    const { getCookie } = useCookieStore()

    const getParams = useSearchParams()

    const id = getParams.get('id') ?? ""

    const form = useForm({ defaultValues: defaulValues })

    const { onSubmit } = useAuthLoginRegisterBe()

    const { onParseAddress } = useWalletParseAddressBe()

    const { data: dataCampaignBe } = useGetCampaignBeLock(id)

    const { lockFunction, unlockFunction, getContract, getUtxo, contract, setPlutusScript, plutusScript, utxo, isLoading: isLoadingLockFunction } = useWalletTransactionBe()

    useEffect(() => {
        onSubmit({ name: "thuannguyen.fososoft@gmail.com", password: "Foso@2024" }, "login")
    }, [])

    useEffect(() => {
        if (address) {
            onParseAddress(address)
        }
    }, [address])


    useEffect(() => {
        if (dataCampaignBe) {
            form.setValue("createContract.auditName", dataCampaignBe?.name)
            form.setValue("createContract.amount", dataCampaignBe?.expense)
        }
    }, [dataCampaignBe])

    useEffect(() => {
        if (contract) setPlutusScript(formatContract(contract.contract));
    }, [contract]);

    return (
        <div className="flex flex-col gap-4 justify-between items-center  max-w-[450px]">
            <h1 className={'w-full text-start text-base text-black font-medium'}>Create smart contract</h1>
            <div className="flex items-center justify-start w-full gap-4">
                <CardanoWallet />
                <div className="flex flex-col gap-1">
                    <h1 className="cursor-pointer font-semibold text-black">
                        {getCookie("username") ?? ""}
                    </h1>
                </div>
            </div>
            <div className={'flex flex-col gap-2 w-full'}>
                <Form {...form}>
                    <div className="grid grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name="createContract.auditName"
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Required Audit Name!',
                                },
                            }}
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem className="col-span-1">
                                        <FormLabel
                                            className="2xl:text-sm lg:text-xs font-semibold tracking-wider text-black">
                                            Audit Name <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div
                                                className={`w-full cursor-default text-black disabled:text-black disabled:opacity-100 h-11 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
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
                            name="createContract.amount"
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Required Amount to lock (ADA)!',
                                },
                            }}
                            render={({ field, fieldState }) => {
                                return (
                                    <FormItem className="col-span-1">
                                        <FormLabel
                                            className="2xl:text-sm lg:text-xs font-semibold tracking-wider text-black">
                                            Amount to lock (ADA) <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div
                                                className={`w-full cursor-default text-black disabled:text-black disabled:opacity-100 h-11 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
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
                    </div>
                    <div className="flex justify-end w-full">
                        <ButtonLoading
                            disabled={isLoadingLockFunction}
                            isStateloading={isLoadingLockFunction}
                            onClick={form.handleSubmit((data) => {
                                lockFunction({ ...data, idCampaign: id })
                            })}
                            title="Submit"
                            type='submit'
                            className='py-[13px] px-4 w-full dark:text-white h-auto bg-[#3276FA] hover:bg-[#3276FA]/80 rounded-xl'
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Lock