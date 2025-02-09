import { PrismaClient } from '@prisma/client';
import { JsonRpcProvider } from "ethers";

const prisma = new PrismaClient();
const provider = new JsonRpcProvider(process.env.ALCHEMY_ETH_RPC_URL);

let BLOCK = 21809678;
let ADDRESSES = ["0x2A088A920bd24f3512dA9A6398bf8da11F39fEDe"];

async function getInterestedAddresses() {
    // Fetch all users from database
    const data = await prisma.user.findMany();

    // Fetch all wallets from database
    let walletIds = data.map((user) => user.mainWalletId);
    let wallets = await prisma.wallet.findMany({
        where: {
            id: {
                in: walletIds
            }
        }
    });

    // Extract public keys from wallets
    ADDRESSES = wallets.map((wallet) => wallet.publicKey);
    console.log(`Interested addresses: ${ADDRESSES}`);
}

async function getLatestBlock() {
    const latestBlock = await provider.getBlockNumber();
    BLOCK = latestBlock;
    console.log(`Latest block: ${latestBlock}`);
}



async function main() {
    // Get interested addresses from database
    // await getInterestedAddresses();

    // Get the 10th block behind latest block number
    // Reason - ETH chain can be forked and to avoid
    // processing data that's not in the main chain
    // await getLatestBlock();

    // Inspect the block for native eth txns 
    // involving the interested addresses
    console.log(`Inspecting block: ${BLOCK}`);
    const block = await provider.getBlock(BLOCK, true);
    const txns = block?.transactions;
    
    if (!txns) {
        console.log("No transactions found");
        return;
    }

    for (let txn of txns) {
        const txnDetails = await provider.getTransaction(txn);
        if (txnDetails?.to === ADDRESSES[0] || txnDetails?.from === ADDRESSES[0]) {
            console.log(`Transaction Details:
                Hash: ${txnDetails.hash}
                From: ${txnDetails.from}
                To: ${txnDetails.to}
                Value: ${txnDetails.value.toString()}
                Gas Price: ${txnDetails.gasPrice.toString()}
                Gas Limit: ${txnDetails.gasLimit.toString()}
                Nonce: ${txnDetails.nonce}
                Data: ${txnDetails.data}
                Block Number: ${txnDetails.blockNumber}
            `);
            return;
        }
    }

    console.log("No transactions found for the adresses.");
}

// Run the script
main();