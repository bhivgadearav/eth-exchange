import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

export const generateSeed = () => {
    const HDMnemonic = generateMnemonic();
    const HDSeed = mnemonicToSeed(HDMnemonic);
    return {HDMnemonic, HDSeed};
};

export const generateWallet = async (index: number) => {
    const { HDSeed: seed, HDMnemonic } = generateSeed();
    const mnemonic = HDMnemonic.split(" ")
    const solanaSeed = await seed.then(bytes => bytes.toString('hex'));
    const path = `m/44'/501'/${index == 0 ? 0 : index-1}'/0'`; 
    const derivedSeed = derivePath(path, solanaSeed).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret)
    const publicKey = keypair.publicKey.toBase58()
    const privateKey = bs58.encode(keypair.secretKey)
    return {
        mnemonic,
        publicKey,
        privateKey
    };
}