"use client";
import { toastCore } from "@/lib/toast";
import apiWallet from "@/services/wallet/wallet.services";
import { useWalletStateBe } from "@/store/walletStore";
import { Transaction, MeshTxBuilder, TxIn, MintItem, Data } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import moment from "moment";
interface IData {
    createContract: {
        amount: string; // type for amount
        auditName: string; // type for auditName
    };
    closingTheContract: {
        lockedTxHash: string;
        reCeiveAddress: string;
        keyReceiveMoney?: any;
    };
    datum: Array<any>; // type for datum, adjust as necessary
    idCampaign?: string | number | any;
    money_ada?: string | number | any;
    list_key?: Array<any>;
    id_lock?: string | number | any;
}

export const useWalletTransactionBe = () => {
    const queryClient = useQueryClient();

    const { connected, wallet } = useWallet();

    const { setValidateMessage, dataAddress } = useWalletStateBe();

    const scriptAddressLock = queryClient.getQueryData(["getCampaignBe"]) as any;

    const scriptAddressUnLock = (queryClient.getQueryData(["getCampaignBeUnLock"]) as any) ?? "";

    // let scriptAddresss = "addr1w87l06eqtw5m546qxtd5nlxm7f8xfkfu9g2fua7gsp7wqsgyx9tl0";

    const [utxo, setUtxo] = useState<any>(null);

    const [plutusScript, setPlutusScript] = useState<any>({ code: "", version: "" });

    const initContract = { selected: "", contracts: [] };

    const [redeemer, setRedeemer] = useState<any>([]);

    const [contract, setContract] = useState<any>(initContract);

    // const lockFunctionBeMutate = useMutation({
    //     mutationFn: async ({ data, formData }: { data: IData; formData: FormData }) => {
    //         return await apiWallet.postCreateLock(data?.idCampaign, formData);
    //     },
    // });
    const lockFunctionBeMutate = useMutation({
        mutationFn: async (formData: FormData) => {
            return await apiWallet.postCreateListLock(formData);
        },
    });

    const unlockFunctionBeMutate = useMutation({
        mutationFn: async (formData: FormData) => {
            return await apiWallet.postListUnLock(formData);
        },
    });
    // const unlockFunctionBeMutate = useMutation({
    //     mutationFn: async ({ data, formData }: { data: IData; formData: FormData }) => {
    //         return await apiWallet.postUnLock(data?.idCampaign, formData);
    //     },
    // });

    const lockFunction = async (data: IData) => {
        let formData = new FormData();

        if (!connected) {
            return toastCore.error("Vui lòng kết nối ví!");
        }
        for (const item of data.list_key || []) {
            const validateMessage = !scriptAddressLock?.address_smart_contract
                ? "No smart contract address, please select a smart contract"
                : !wallet || !connected
                ? "No connected wallet, please connect wallet first"
                : null;

            setValidateMessage(validateMessage);

            const amountToLock = +data.createContract.amount;

            const amountToLockLoveLace = (amountToLock * 1000000).toString();

            const convertData =
                (data?.list_key &&
                    data.list_key.map((e: any) => [
                        `${e?.key_string}`,
                        +e?.key_number,
                        moment(`${e?.key_date} 00:00:00`, "DD/MM/YYYY HH:mm").valueOf(),
                    ])) ||
                [];

            const time = moment("15/11/2024 15:20", "DD/MM/YYYY HH:mm").valueOf();

            // let datum = [dataAddress.pKeyHash];
            // let datum = [
            //     ["thuan", Number("0772818495"), time],
            //     ["thuan", Number("0772818495"), time],
            // ];

            const datum = [
                `${item?.key_string}`,
                +item?.key_number,
                moment(`${item?.key_date} 00:00:00`, "DD/MM/YYYY HH:mm").valueOf(),
            ];

            const d: Data = {
                alternative: 0,
                fields: datum,
            };

            if (wallet && connected && amountToLock) {
                const tx = new Transaction({ initiator: wallet });
                tx.sendLovelace(
                    {
                        address: scriptAddressLock?.address_smart_contract,
                        datum: {
                            value: d,
                            inline: true,
                        },
                    },
                    amountToLockLoveLace
                );

                let txHash = "";

                const payloadData = {
                    name: data.createContract.auditName,
                    amount: amountToLock,
                    smartContractId: scriptAddressLock?.id_contract_paas,
                    scriptAddress: scriptAddressLock?.address_smart_contract,
                    assetName: "Ada",
                    isLockSuccess: false,
                    datum: datum,
                    // datum: [datum],
                };
                try {
                    const unsignedTx = await tx.build();
                    console.log("unsignedTx", unsignedTx);

                    const signedTx = await wallet.signTx(unsignedTx);

                    console.log("signedTx", signedTx);

                    txHash = await wallet.submitTx(signedTx);
                } catch (e) {
                    const { data } = await apiWallet.plutustxs({ ...payloadData });
                    toastCore.error("Tạo hợp đồng thất bại");
                    continue; // Bỏ qua phần tử thất bại và tiếp tục với phần tử tiếp theo
                }

                console.log("txHash", txHash);

                const { data: response } = await apiWallet.plutustxs({
                    ...payloadData,
                    isLockSuccess: true,
                    lockedTxHash: txHash,
                });

                if (response) {
                    formData.append(`list_lock[${0}][key_string]`, item?.key_string);
                    formData.append(`list_lock[${0}][key_date]`, item?.key_date);
                    formData.append(`list_lock[${0}][key_number]`, item?.key_number);
                    formData.append(`list_lock[${0}][id_lock]`, txHash);
                    formData.append(
                        `list_lock[${0}][id_lock_address_cardano]`,
                        scriptAddressLock?.address_smart_contract
                    );

                    const { data: res } = await lockFunctionBeMutate.mutateAsync(formData);
                    if (res?.result) {
                        toastCore.success(res?.message);
                        setTimeout(() => {
                            window.close();
                        }, 1200);
                    } else {
                        toastCore.error(res?.message);
                    }
                }
            }
        }

        // const d: Data = {
        //     alternative: 0,
        //     fields: datum,
        // };
        // if (wallet && connected && amountToLock) {
        //     const tx = new Transaction({ initiator: wallet });
        //     tx.sendLovelace(
        //         {
        //             address: scriptAddressLock,
        //             datum: {
        //                 value: d,
        //                 inline: true,
        //             },
        //         },
        //         amountToLockLoveLace
        //     );

        //     let txHash = "";

        //     const payloadData = {
        //         name: data.createContract.auditName,
        //         amount: amountToLock,
        //         smartContractId: "66ce0014cb1fdbba25304a3e",
        //         // smartContractId: "66374d040da0bf446cda98c6",
        //         scriptAddress: scriptAddressLock,
        //         assetName: "Ada",
        //         isLockSuccess: false,
        //         datum: datum,
        //     };

        //     try {
        //         const unsignedTx = await tx.build();
        //         const signedTx = await wallet.signTx(unsignedTx);
        //         txHash = await wallet.submitTx(signedTx);
        //     } catch (e) {
        //         const { data } = await apiWallet.plutustxs({ ...payloadData });
        //         toastCore.error("Tạo hợp đồng thất bại");
        //         return;
        //     }

        //     const { data: response } = await apiWallet.plutustxs({
        //         ...payloadData,
        //         isLockSuccess: true,
        //         lockedTxHash: txHash,
        //     });

        //     if (response && data.list_key) {
        //         // formData.append("id_lock", txHash);
        //         // formData.append("id_address_cardano", dataAddress?.address);
        //         data.list_key.forEach((e: any, index: number) => {
        //             formData.append(`list_lock[${index}][key_string]`, e?.key_string);
        //             formData.append(`list_lock[${index}][key_date]`, e?.key_date);
        //             formData.append(`list_lock[${index}][key_number]`, e?.key_number);
        //             formData.append(`list_lock[${index}][id_lock]`, txHash);
        //             formData.append(`list_lock[${index}][id_lock_address_cardano]`, scriptAddressLock);
        //         });

        //         const { data: res } = await lockFunctionBeMutate.mutateAsync(formData);
        //         if (res?.result) {
        //             toastCore.success(res?.message);
        //             setTimeout(() => {
        //                 window.close();
        //             }, 1200);
        //             return;
        //         }
        //         toastCore.error(res?.message);
        //     }
        // }
    };

    const unlockFunction = async (data: IData) => {
        console.log("data", data);

        let formData = new FormData();

        const parseArr = JSON.parse(data?.closingTheContract.keyReceiveMoney);

        if (!connected) {
            return toastCore.error("Vui lòng kết nối ví!");
        }
        const address = await wallet.getChangeAddress();
        const collateralUtxos = await wallet.getCollateral();
        let message = null;

        if (!utxo || !data.closingTheContract.reCeiveAddress || !address) {
            message = !utxo
                ? "UTXO is not found"
                : !data.closingTheContract.reCeiveAddress
                ? "No receiver address"
                : !address
                ? "No signer address"
                : null;
            return toastCore.error(message);
        }

        // const time = moment("15/11/2024 15:20", "DD/MM/YYYY HH:mm").valueOf();
        // const convertData =
        //     (data?.list_key &&
        //         data.list_key.map((e: any) => [
        //             e?.key_string,
        //             +e?.key_number,
        //             moment(e?.key_date, "DD/MM/YYYY HH:mm").valueOf(),
        //         ])) ||
        //     [];

        const r = { data: { alternative: 0, fields: parseArr } };
        // const r = { data: { alternative: 0, fields: ["thuan", Number("772818495"), time] } };
        // const r = { data: { alternative: 0, fields: [] } };
        // create the unlock asset transaction
        let txHash;
        console.log("utxo", utxo);

        try {
            const tx = new Transaction({ initiator: wallet });
            console.log("tx 1", tx);
            console.log("ok", {
                value: utxo,
                script: plutusScript,
                redeemer: r,
            });

            tx.redeemValue({
                value: utxo,
                script: plutusScript,
                redeemer: r,
            })
                .sendValue(data.closingTheContract.reCeiveAddress, utxo) // address is recipient address
                //   .setCollateral(collateralUtxos) //this is option, we either set or not set still works
                .setRequiredSigners([address]);

            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx, true);
            txHash = await wallet.submitTx(signedTx);
        } catch (err) {
            console.log(err);
            console.log("Submit error");
            const res = await apiWallet.unlockPlutustxs(
                {
                    isUnlockSuccess: false,
                    redeemer: redeemer,
                },
                data.closingTheContract.lockedTxHash
            );
            toastCore.error("Submit error");
            return;
        }

        const res = await apiWallet.unlockPlutustxs(
            {
                isUnlockSuccess: true,
                unlockedTxHash: txHash,
                redeemer: redeemer,
            },
            data.closingTheContract.lockedTxHash
        );

        console.log("res susses", res);

        if (res) {
            formData.append("id_lock", data?.id_lock);
            formData.append("id_unlock", txHash);
            formData.append("id_unlock_address_cardano", dataAddress?.address);
            formData.append("money_ada", data?.money_ada);

            formData.append("key_string", parseArr[0]);
            formData.append("key_number", parseArr[1]);
            formData.append("key_date", parseArr[2]);

            const { data: res } = await unlockFunctionBeMutate.mutateAsync(formData);
            if (res?.result) {
                toastCore.success(res?.message);
                setTimeout(() => {
                    window.close();
                }, 1200);
                return;
            }
            toastCore.error(res?.message);
        }
        toastCore.success("Transaction is submitted");
    };

    const utxoMutation = useMutation({
        mutationFn: async ({
            scriptAddressUnLock,
            lockedTxHash,
        }: {
            scriptAddressUnLock: any;
            lockedTxHash: string;
        }) => {
            return await apiWallet.findutxo(scriptAddressUnLock, lockedTxHash);
        },
        retry: 3,
        gcTime: 3000,
        retryDelay: 3000,
    });

    const getUtxo = async (lockedTxHash: any) => {
        const { data } = await utxoMutation.mutateAsync({
            scriptAddressUnLock: scriptAddressUnLock?.address_smart_contract,
            lockedTxHash: lockedTxHash,
        });
        setUtxo(data);
    };

    const getContract = async () => {
        console.log("scriptAddressUnLock", scriptAddressUnLock);

        const { data } = await apiWallet.contracts(
            scriptAddressLock?.id_contract_paas || scriptAddressUnLock?.id_contract_paas
        );

        setContract({ ...data, selected: data?._id });
    };

    return {
        lockFunction,
        unlockFunction,
        getUtxo,
        getContract,
        contract,
        plutusScript,
        setPlutusScript,
        utxo,
        isLoading: lockFunctionBeMutate.isPending || unlockFunctionBeMutate.isPending || utxoMutation.isPending,
    };
};
