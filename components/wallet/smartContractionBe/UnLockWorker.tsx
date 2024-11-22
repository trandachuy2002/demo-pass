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
import { useTheme } from "next-themes";
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

interface IParams {
    datum: any[]
    idCampaign: number,
    idLock: string,
    idWallet: string,
    theme: string
}

const UnLockWorker = () => {
    const formatContract = (contract: any): PlutusScript => {
        return {
            code: contract?.cborHex,
            version: contract?.type === "PlutusScriptV1" ? "V1" : "V2",
        };
    };

    const { setTheme, theme } = useTheme()

    const address = useAddress()

    const { connected, connect, wallet } = useWallet();

    const { getCookie } = useCookieStore()

    const getParams = useSearchParams()

    const dataPrams = (getParams.get('params') ?? "{}")

    const parseParams = JSON.parse(dataPrams) as IParams || {}

    const form = useForm({ defaultValues: defaulValues })

    const { onSubmit } = useAuthLoginRegisterBe()

    const { onParseAddress } = useWalletParseAddressBe()

    const { data: dataCampaignBeUnLock } = useGetCampaignBeUnLock(`${parseParams.idCampaign}`)

    const { unlockFunction, getContract, getUtxo, contract, setPlutusScript, isLoading } = useWalletTransactionBe()

    useEffect(() => {
        onSubmit({ name: "thuannguyen.fososoft@gmail.com", password: "Foso@2024" }, "login")
    }, [])



    useEffect(() => {
        if (parseParams.theme) {
            console.log("themetheme", theme);

            console.log("parseParams", parseParams);

            setTheme(parseParams.theme)
        }
        if (dataCampaignBeUnLock?.result) {
            if (parseParams.idWallet) {
                connect(parseParams.idWallet)
                form.setValue("closingTheContract.lockedTxHash", parseParams.idLock)
                form.setValue("closingTheContract.keyReceiveMoney", JSON.stringify(parseParams.datum))
                if (!connected) return
                getContract();
                getUtxo(parseParams.idLock)

            }
        }
    }, [dataCampaignBeUnLock, connected])

    useEffect(() => {
        if (address) {
            onParseAddress(address)
        }
    }, [address])


    useEffect(() => {
        if (contract) setPlutusScript(formatContract(contract.contract));
    }, [contract]);

    return (
        <div className="flex flex-col gap-6 justify-between items-center  max-w-[450px] min-w-[450px] bg-white dark:bg-[#242B4280] dark:shadow-none shadow-[0px_0px_120px_16px_#979FB71A]py-6 md:px-8 px-6 rounded-[12px]  w-full p-5">
            <div className="flex flex-col gap-2">
                <h1 className={'w-full text-center text-base text-black dark:text-white font-medium'}>Unlock smart contract</h1>
                <h2 className="text-[#6B7A94] dark:text-[#99A8C1] font-normal text-small-default text-center">You can get commission 1 time only!</h2>
            </div>
            <div className={'flex flex-col gap-4 w-full'}>
                <Form {...form}>
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
                                <FormItem className="col-span-2">
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
                    <div className="flex justify-end w-full">
                        <ButtonLoading
                            disabled={isLoading}
                            isStateloading={isLoading}
                            onClick={form.handleSubmit((data) => {
                                unlockFunction({ ...data, id_lock: parseParams.idLock, money_ada: dataCampaignBeUnLock?.expense });
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

export default UnLockWorker