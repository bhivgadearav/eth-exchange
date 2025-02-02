"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userTypes_1 = require("../types/userTypes");
// Create the Txn sub-schema
const TxnSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    signature: { type: String, required: true },
    status: {
        type: String,
        enum: [userTypes_1.TransactionStatus.PENDING, userTypes_1.TransactionStatus.SUCCESS, userTypes_1.TransactionStatus.FAILED],
        required: true,
    },
}, { _id: false });
// Create the Wallet sub-schema
const WalletSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    publicKey: { type: String, required: true },
    privateKey: { type: String, required: true },
    balance: { type: Number, required: true },
    txns: { type: [TxnSchema], default: [] },
}, { _id: false });
// Create the ChainDetails sub-schema
const ChainDetailsSchema = new mongoose_1.Schema({
    mnemonic: { type: [String], required: true },
    wallets: { type: [WalletSchema], default: [] },
}, { _id: false });
// Create the User schema matching exactly the User type defined in userTypes.ts
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    chainDetails: { type: ChainDetailsSchema, required: true },
    mainWallet: { type: WalletSchema, required: true },
});
// Export the User model
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
