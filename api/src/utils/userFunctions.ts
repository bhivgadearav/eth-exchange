import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { Wallet, HDNodeWallet } from "ethers";

export const generateSeed = () => {
    const HDMnemonic = generateMnemonic();
    const HDSeed = mnemonicToSeed(HDMnemonic);
    return {HDMnemonic, HDSeed};
};

export const generateWallet = async (index: number) => {
    const {HDMnemonic, HDSeed} = await generateSeed();
    const mnemonic = HDMnemonic.split(" ");
    const seed = await HDSeed;
    const path = `m/44'/60'/${index}'/0'`; 
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(path);
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);
    const publicKey = wallet.address;
    return {
        mnemonic,
        publicKey,
        privateKey
    };
}