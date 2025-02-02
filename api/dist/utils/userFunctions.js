"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWallet = exports.generateSeed = void 0;
const bip39_1 = require("bip39");
const ethers_1 = require("ethers");
const generateSeed = () => {
    const HDMnemonic = (0, bip39_1.generateMnemonic)();
    const HDSeed = (0, bip39_1.mnemonicToSeed)(HDMnemonic);
    return { HDMnemonic, HDSeed };
};
exports.generateSeed = generateSeed;
const generateWallet = (index) => __awaiter(void 0, void 0, void 0, function* () {
    const { HDMnemonic, HDSeed } = yield (0, exports.generateSeed)();
    const mnemonic = HDMnemonic.split(" ");
    const seed = yield HDSeed;
    const path = `m/44'/60'/${index}'/0'`;
    const hdNode = ethers_1.HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(path);
    const privateKey = child.privateKey;
    const wallet = new ethers_1.Wallet(privateKey);
    const publicKey = wallet.address;
    return {
        mnemonic,
        publicKey,
        privateKey
    };
});
exports.generateWallet = generateWallet;
