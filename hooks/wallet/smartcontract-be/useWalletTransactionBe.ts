"use client";
import { toastCore } from "@/lib/toast";
import apiWallet from "@/services/wallet/wallet.services";
import { useWalletStateBe } from "@/store/walletStore";
import { Transaction, MeshTxBuilder, TxIn, MintItem } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface IData {
    createContract: {
        amount: string; // type for amount
        auditName: string; // type for auditName
    };
    closingTheContract: {
        lockedTxHash: string;
        reCeiveAddress: string;
    };
    datum: Array<any>; // type for datum, adjust as necessary
    idCampaign?: string | number | any;
    money_ada?: string | number | any;
}

export const useWalletTransactionBe = () => {
    const queryClient = useQueryClient();

    const { connected, wallet } = useWallet();

    const { setValidateMessage, dataAddress } = useWalletStateBe();

    const scriptAddressLock = (queryClient.getQueryData(["getCampaignBe"]) as any)?.address_smart_contract ?? "";

    const scriptAddressUnLock =
        (queryClient.getQueryData(["getCampaignBeUnLock"]) as any)?.address_smart_contract ?? "";

    // let scriptAddresss = "addr1w87l06eqtw5m546qxtd5nlxm7f8xfkfu9g2fua7gsp7wqsgyx9tl0";

    const [utxo, setUtxo] = useState<any>(null);

    const [plutusScript, setPlutusScript] = useState<any>({ code: "", version: "" });

    const initContract = { selected: "", contracts: [] };

    const [redeemer, setRedeemer] = useState<any>([]);

    const [contract, setContract] = useState<any>(initContract);

    const lockFunctionBeMutate = useMutation({
        mutationFn: async ({ data, formData }: { data: IData; formData: FormData }) => {
            return await apiWallet.postCreateLock(data?.idCampaign, formData);
        },
    });

    const unlockFunctionBeMutate = useMutation({
        mutationFn: async ({ data, formData }: { data: IData; formData: FormData }) => {
            return await apiWallet.postUnLock(data?.idCampaign, formData);
        },
    });

    const lockFunction = async (data: IData) => {
        let formData = new FormData();

        if (!connected) {
            return toastCore.error("Vui lòng kết nối ví!");
        }
        const validateMessage = !scriptAddressLock
            ? "No smart contract address, please select a smart contract"
            : !wallet || !connected
            ? "No connected wallet, please connect wallet first"
            : null;

        setValidateMessage(validateMessage);

        const amountToLock = +data.createContract.amount;

        const amountToLockLoveLace = (amountToLock * 1000000).toString();

        let datum = [dataAddress.pKeyHash];

        const d: any = {
            alternative: 0,
            fields: datum,
        };

        if (wallet && connected && amountToLock) {
            const tx = new Transaction({ initiator: wallet });
            tx.sendLovelace(
                {
                    address: scriptAddressLock,
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
                smartContractId: "66374d040da0bf446cda98c6",
                scriptAddress: scriptAddressLock,
                assetName: "Ada",
                isLockSuccess: false,
                datum: datum,
                // datum: data.datum.map((e) => e.value),
            };

            try {
                const unsignedTx = await tx.build();
                const signedTx = await wallet.signTx(unsignedTx);
                txHash = await wallet.submitTx(signedTx);
            } catch (e) {
                const { data } = await apiWallet.plutustxs({ ...payloadData });
                toastCore.error("Tạo hợp đồng thất bại");
                return;
            }

            const { data: response } = await apiWallet.plutustxs({
                ...payloadData,
                isLockSuccess: true,
                lockedTxHash: txHash,
            });

            if (response) {
                formData.append("id_lock", txHash);
                formData.append("id_address_cardano", dataAddress?.address);

                const { data: res } = await lockFunctionBeMutate.mutateAsync({ data, formData });
                if (res?.result) {
                    toastCore.success(res?.message);
                    setTimeout(() => {
                        window.close();
                    }, 1200);
                    return;
                }
                toastCore.error(res?.message);
            }
        }
    };

    const unlockFunction = async (data: IData) => {
        let formData = new FormData();
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
        const r = { data: { alternative: 0, fields: [] } };
        // create the unlock asset transaction
        let txHash;

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

        if (res) {
            formData.append("id_unlock", txHash);
            formData.append("id_unlock_address_cardano", dataAddress?.address);
            formData.append("money_ada", data?.money_ada);
            const { data: res } = await unlockFunctionBeMutate.mutateAsync({ data, formData });
            if (res?.result) {
                toastCore.success(res?.message);
                setTimeout(() => {
                    window.close();
                }, 1200);
                return;
            }
            toastCore.error(res?.message);
        }
        // toastCore.success("Transaction is submitted");
    };

    const getUtxo = async (lockedTxHash: any) => {
        const { data } = await apiWallet.findutxo(scriptAddressUnLock, lockedTxHash);
        setUtxo(data);
    };

    const getContract = async () => {
        const { data } = await apiWallet.contracts("66374d040da0bf446cda98c6");

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
        isLoading: lockFunctionBeMutate.isPending,
    };
};
