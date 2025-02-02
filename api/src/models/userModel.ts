import { Schema, model } from "mongoose";
import { TransactionStatus, Txn, Wallet, ChainDetails, User } from "../types/userTypes";

const TxnSchema = new Schema<Txn>(
    {
        id: { type: String, required: true },
        signature: { type: String, required: true },
        status: {
            type: String,
            enum: [TransactionStatus.PENDING, TransactionStatus.SUCCESS, TransactionStatus.FAILED],
            required: true,
        },
    },
    { _id: false }
);

const WalletSchema = new Schema<Wallet>(
    {
        name: { type: String, required: true },
        publicKey: { type: String, required: true },
        privateKey: { type: String, required: true },
        balance: { type: Number, required: true },
        txns: { type: [TxnSchema], default: [] },
    },
    { _id: false }
);

const ChainDetailsSchema = new Schema<ChainDetails>(
    {
        mnemonic: { type: [String], required: true },
        wallets: { type: [WalletSchema], default: [] },
    },
    { _id: false }
);

const UserSchema = new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    chainDetails: { type: ChainDetailsSchema, required: true },
    mainWallet: { type: WalletSchema, required: true },
});

export const UserModel = model<User>("User", UserSchema);
