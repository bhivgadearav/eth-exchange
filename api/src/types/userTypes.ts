export enum TransactionStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

export type Txn = {
    id: string;
    signature: string;
    status: TransactionStatus;
}

export type Wallet = {
    name: string;
    publicKey: string;
    privateKey: string;
    balance: number;
    txns: Txn[];
}

export type ChainDetails = {
    mnemonic: string[];
    wallets: Wallet[];
}

export type User = {
    username: string;
    email: string;
    password: string;
    chainDetails: ChainDetails;
    mainWallet: Wallet;
}
