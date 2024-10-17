import { toastCore } from "@/lib/toast";
import apiWallet from "@/services/wallet/wallet.services";
import { useWalletStore } from "@/store/walletStore";
import { Transaction } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
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
}
export const useWalletTransaction = () => {
    const { connected, wallet } = useWallet();

    const { setValidateMessage, dataAddress } = useWalletStore();

    let scriptAddress = "addr1w87l06eqtw5m546qxtd5nlxm7f8xfkfu9g2fua7gsp7wqsgyx9tl0";

    const [utxo, setUtxo] = useState<any>(null);

    const [plutusScript, setPlutusScript] = useState<any>({
        code: "",
        version: "",
    });
    const initContract = {
        selected: "",
        contracts: [],
    };
    const [redeemer, setRedeemer] = useState<any>([]);

    const [contract, setContract] = useState<any>(initContract);

    const lockFunction = async (data: IData) => {
        if (!connected) {
            return toastCore.error("Vui lòng kết nối ví!");
        }
        // địa chỉ gắn cứng
        const validateMessage = !scriptAddress
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
                    address: scriptAddress,
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
                scriptAddress: scriptAddress,
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
            console.log(txHash ? `Transaction is submmited: ${txHash}` : null);
            const { data: response } = await apiWallet.plutustxs({
                ...payloadData,
                isLockSuccess: true,
                lockedTxHash: txHash,
            });
            toastCore.success("Tạo hợp đồng thành công");
            console.log("txHash", txHash);
            console.log("response", response);
        }
    };

    const unlockFunction = async (data: IData) => {
        const address = await wallet.getChangeAddress();
        const collateralUtxos = await wallet.getCollateral();
        let message = null;
        console.log("utxo", utxo);
        console.log("data.closingTheContract.reCeiveAddress", data.closingTheContract.reCeiveAddress);

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
            const tx = new Transaction({ initiator: wallet })
                .redeemValue({
                    value: utxo,
                    script: plutusScript,
                    redeemer: r,
                })
                .sendValue(data.closingTheContract.reCeiveAddress, utxo) // address is recipient address
                //   .setCollateral(collateralUtxos) //this is option, we either set or not set still works
                .setRequiredSigners([address]);
            console.log(1);
            const unsignedTx = await tx.build();

            console.log(2);
            const signedTx = await wallet.signTx(unsignedTx, true);
            console.log(3);
            txHash = await wallet.submitTx(signedTx);
        } catch (err) {
            console.log(err);
            console.log("Submit error");
            const res = apiWallet.unlockPlutustxs(
                {
                    isUnlockSuccess: false,
                    redeemer: redeemer,
                },
                data.closingTheContract.lockedTxHash
            );
            toastCore.error("Submit error");
            return;
        }

        console.log(`Transaction is submitted, TxHash: ${txHash}`);
        const res = apiWallet.unlockPlutustxs(
            {
                isUnlockSuccess: true,
                unlockedTxHash: txHash,
                redeemer: redeemer,
            },
            data.closingTheContract.lockedTxHash
        );
        toastCore.success("Transaction is submitted");
        console.log("unlockTxHash", txHash);
    };

    const getUtxo = async (form: any) => {
        const { data } = await apiWallet.findutxo(scriptAddress, form.watch("closingTheContract.lockedTxHash"));
        setUtxo(data);
    };

    const getContract = async (form: any) => {
        const { data } = await apiWallet.contracts("66374d040da0bf446cda98c6");

        setContract({ ...data, selected: data._id });
    };

    return { lockFunction, unlockFunction, getUtxo, getContract, contract, plutusScript, setPlutusScript, utxo };
};
