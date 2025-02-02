import { Request, Response } from "express";
import { UserModel } from "./models/userModel";
import { generateWallet } from "./utils/userFunctions";
import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, walletName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const { mnemonic, publicKey, privateKey } = await generateWallet(0);
        const newUser = new UserModel({
            username: name,
            email: email,
            password: hashedPassword,
            chainDetails: {
                mnemonic: mnemonic,
                wallets: [{Name: walletName, PublicKey: publicKey, PrivateKey: privateKey}]
            },
            mainWallet: {Name: walletName, PublicKey: publicKey, PrivateKey: privateKey}
        });
        await newUser.save();
        res.status(201).json({
            message: 'User created',
            mnemonic: mnemonic,
            publicKey: publicKey,
            privateKey: privateKey
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Signup failed', details: error.message });
    }
};