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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const userModel_1 = require("./models/userModel");
const userFunctions_1 = require("./utils/userFunctions");
const bcrypt_1 = __importDefault(require("bcrypt"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, walletName } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const { mnemonic, publicKey, privateKey } = yield (0, userFunctions_1.generateWallet)(0);
        const newUser = new userModel_1.UserModel({
            username: name,
            email: email,
            password: hashedPassword,
            chainDetails: {
                mnemonic: mnemonic,
                wallets: [{ Name: walletName, PublicKey: publicKey, PrivateKey: privateKey }]
            },
            mainWallet: { Name: walletName, PublicKey: publicKey, PrivateKey: privateKey }
        });
        yield newUser.save();
        res.status(201).json({
            message: 'User created',
            mnemonic: mnemonic,
            publicKey: publicKey,
            privateKey: privateKey
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Signup failed', details: error.message });
    }
});
exports.signup = signup;
