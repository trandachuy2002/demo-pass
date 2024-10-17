"use client";

import { useWalletParseAddres } from "@/hooks/wallet/useWalletParseAddres";
import { useWalletTransaction } from "@/hooks/wallet/useWalletTransaction";
import { useWalletStore } from "@/store/walletStore";
import { CardanoWallet, useAddress, useWallet } from '@meshsdk/react';
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/store/authStores";
import useCookieStore from "@/store/useCookieStore";
import { useAlertDialogStore } from "@/store/useAlertDialogStore";


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
declare const LANGUAGE_VERSIONS: {
    V1: string;
    V2: string;
    V3: string;
};
const Wallet = () => {
    type LanguageVersion = keyof typeof LANGUAGE_VERSIONS;
    type PlutusScript = {
        version: LanguageVersion;
        code: string;
    };
    const formatContract = (contract: any): PlutusScript => {
        return {
            code: contract?.cborHex,
            version: contract?.type === "PlutusScriptV1" ? "V1" : "V2",
        };
    };

    const address = useAddress()

    const { connected } = useWallet();

    const { dataAddress } = useWalletStore()

    const { informationUser } = useAuthStore()

    const { getCookie } = useCookieStore('username')

    const { setOpenAlertDialog } = useAlertDialogStore()

    const form = useForm({ defaultValues: defaulValues })

    const { onParseAddress, isLoading } = useWalletParseAddres()

    const [isTab, setIsTab] = useState<string>('createContract')

    const { lockFunction, unlockFunction, getContract, getUtxo, contract, setPlutusScript, plutusScript, utxo } = useWalletTransaction()


    useEffect(() => {
        getContract(form);
        if (form.watch('closingTheContract.lockedTxHash')) getUtxo(form);
    }, [form.watch('closingTheContract.lockedTxHash')]);



    useEffect(() => {
        if (address) {
            onParseAddress(address)
        }
    }, [address])

    useEffect(() => {
        if (!connected) {
            const updatedDatum = form.getValues("datum").map((item) => {
                return {
                    ...item,
                    value: ""
                }
            });
            form.setValue("datum", updatedDatum);
        }
    }, [connected])

    useEffect(() => {
        if (dataAddress) {
            const updatedDatum = form.getValues("datum").map((item, index) => {
                form.clearErrors(`datum.${index}.value`);
                return {
                    ...item,
                    value: isTab == 'createContract' ? dataAddress.pKeyHash : ""
                }
            });
            form.setValue("datum", updatedDatum);
        }
    }, [dataAddress, isTab])

    useEffect(() => {
        if (contract) setPlutusScript(formatContract(contract.contract));
    }, [contract]);

    console.log("contract", contract);
    console.log("utxo", utxo);
    console.log("plutusScript", plutusScript);


    return (
        <div className="flex flex-col gap-4 justify-between items-center">
            <div className="flex items-center justify-start w-full gap-4">
                <CardanoWallet />
                <div className="flex flex-col gap-1">
                    <h1
                        className="cursor-pointer font-semibold"
                        onClick={() => {
                            setOpenAlertDialog(true, 'logout')
                        }}
                    >
                        {getCookie() ?? informationUser?.fullName ?? ""}
                    </h1>
                </div>
            </div>
            <Tabs
                defaultValue="createContract"
                value={isTab}
                onValueChange={(e) => {
                    setIsTab(e)
                    form.reset()
                }}
                className="w-full"
            >
                <TabsList className="w-full">
                    <TabsTrigger value="createContract" className="w-1/2">Tạo hợp đồng</TabsTrigger>
                    <TabsTrigger value="closingTheContract" className="w-1/2">Chốt hợp đồng</TabsTrigger>
                </TabsList>
                <TabsContent value="createContract" className="flex flex-col gap-2">
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
                                            <FormLabel className="2xl:text-sm lg:text-xs font-light tracking-wider">
                                                Audit Name <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl >
                                                <Input
                                                    type="text"
                                                    className={`w-full h-auto 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border border-transparent rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
                                                    placeholder="Audit Name"
                                                    {...field}
                                                />
                                            </FormControl>

                                            {
                                                fieldState?.invalid && fieldState?.error && (<FormMessage>{fieldState?.error?.message}</FormMessage>)
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
                                            <FormLabel className="2xl:text-sm lg:text-xs font-light tracking-wider">
                                                Amount to lock (ADA) <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl >
                                                <Input
                                                    type="text"
                                                    className={`w-full h-auto 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border border-transparent rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
                                                    placeholder="Amount to lock (ADA)"
                                                    {...field}
                                                />
                                            </FormControl>

                                            {
                                                fieldState?.invalid && fieldState?.error && (<FormMessage>{fieldState?.error?.message}</FormMessage>)
                                            }
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        {/* <div className="">
                            <FormLabel className="2xl:text-sm lg:text-xs font-light tracking-wider">
                                Datum
                            </FormLabel>
                            {form.watch("datum").map((_, index) => (
                                <div key={index} className="grid grid-cols-2 gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`datum.${index}.type`}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: 'Required data type!',
                                            },
                                        }}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <FormItem className="col-span-1">
                                                    <FormLabel className="2xl:text-sm lg:text-xs font-light tracking-wider">
                                                        Data Type <span className="text-red-500">*</span>
                                                    </FormLabel>
                                                    <FormControl >
                                                        <Select {...field} onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full h-auto 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border border-transparent rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground">
                                                                <SelectValue placeholder="Select data type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {dataType.map((item) => (
                                                                    <SelectItem key={item.value} value={item.label}>
                                                                        {item.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    {fieldState?.invalid && fieldState?.error && (<FormMessage>{fieldState?.error?.message}</FormMessage>)}
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`datum.${index}.value`}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: 'Required Value!',
                                            },
                                        }}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <FormItem className="col-span-1">
                                                    <FormLabel className="2xl:text-sm lg:text-xs font-light tracking-wider">
                                                        Value <span className="text-red-500">*</span>
                                                    </FormLabel>
                                                    <FormControl >
                                                        <Input
                                                            type="text"
                                                            className={`w-full h-auto 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border border-transparent rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
                                                            placeholder="Value"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    {fieldState?.invalid && fieldState?.error && (<FormMessage>{fieldState?.error?.message}</FormMessage>)}
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                            ))}
                        </div> */}
                        {/* Datum value: [{form.watch("datum").map(e => e.value).join(', ')}] */}
                        {/* Contract address: {address} */}
                        <div className="flex justify-end w-full">
                            <Button
                                type="submit"
                                className="bg-blue-500 text-white font-semibold py-2 px-4 block 3xl:rounded-2xl rounded-xl hover:bg-blue-600"
                                onClick={form.handleSubmit((data) => {
                                    lockFunction(data)
                                })}
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                </TabsContent>
                <TabsContent value="closingTheContract" className="flex flex-col gap-2">
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
                                            <FormLabel className="2xl:text-sm lg:text-xs font-light tracking-wider">
                                                Locked Tx hash <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl >
                                                <Input
                                                    type="text"
                                                    className={`w-full h-auto 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border border-transparent rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
                                                    placeholder="Locked Tx hash"
                                                    {...field}
                                                />
                                            </FormControl>

                                            {
                                                fieldState?.invalid && fieldState?.error && (<FormMessage>{fieldState?.error?.message}</FormMessage>)
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
                                            <FormLabel className="2xl:text-sm lg:text-xs font-light tracking-wider">
                                                Receive wallet address <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl >
                                                <Input
                                                    type="text"
                                                    className={`w-full h-auto 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border border-transparent rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
                                                    placeholder="Receive wallet address"
                                                    {...field}
                                                />
                                            </FormControl>

                                            {
                                                fieldState?.invalid && fieldState?.error && (<FormMessage>{fieldState?.error?.message}</FormMessage>)
                                            }
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        {/* <div className="">
                            <FormLabel className="2xl:text-sm lg:text-xs font-light tracking-wider">
                                Redeemmer
                            </FormLabel>
                            {form.watch("datum").map((_, index) => (
                                <div key={index} className="grid grid-cols-2 gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`datum.${index}.type`}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: 'Required data type!',
                                            },
                                        }}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <FormItem className="col-span-1">
                                                    <FormLabel className="2xl:text-sm lg:text-xs font-light tracking-wider">
                                                        Data Type <span className="text-red-500">*</span>
                                                    </FormLabel>
                                                    <FormControl >
                                                        <Select {...field} onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-full h-auto 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border border-transparent rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground">
                                                                <SelectValue placeholder="Select data type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {dataType.map((item) => (
                                                                    <SelectItem key={item.value} value={item.label}>
                                                                        {item.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    {fieldState?.invalid && fieldState?.error && (<FormMessage>{fieldState?.error?.message}</FormMessage>)}
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`datum.${index}.value`}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: 'Required Value!',
                                            },
                                        }}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <FormItem className="col-span-1">
                                                    <FormLabel className="2xl:text-sm lg:text-xs font-light tracking-wider">
                                                        Value <span className="text-red-500">*</span>
                                                    </FormLabel>
                                                    <FormControl >
                                                        <Input
                                                            type="text"
                                                            className={`w-full h-auto 2xl:text-base text-sm font-normal px-3 2xl:py-2.5 py-2 border border-transparent rounded-[8px] border-[#272727] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:bg-[#E6E8EC] disabled:text-muted-foreground`}
                                                            placeholder="Value"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    {fieldState?.invalid && fieldState?.error && (<FormMessage>{fieldState?.error?.message}</FormMessage>)}
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                            ))}
                        </div> */}
                        {/* Redeemmer value: [{form.watch("datum").map(e => e.value).join(', ')}] */}
                        <div className="flex justify-end w-full">
                            <Button
                                type="submit"
                                className="bg-blue-500 text-white font-semibold py-2 px-4 block 3xl:rounded-2xl rounded-xl hover:bg-blue-600"
                                onClick={form.handleSubmit((data) => {
                                    unlockFunction(data)
                                })}
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                </TabsContent>
            </Tabs>

            {/* <div onClick={lockFunction}>handle wallet</div>
            <div onClick={() => {
                if (address) {
                    onParseAddress(address)
                }
            }} className="">
                ADDRESS: {isLoading ? 'Load....' : ""} {address}
            </div> */}

        </div>
    );
};

export default Wallet