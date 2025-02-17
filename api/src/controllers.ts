import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateWallet } from "./utils/userFunctions";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, walletName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const { mnemonic, publicKey, privateKey } = await generateWallet(0);

        const newUser = await prisma.user.create({
            data: {
                username: name,
                email: email,
                password: hashedPassword,
                chainDetails: {
                    create: {
                        mnemonic: { set: mnemonic },
                        wallets: {
                            create: [{
                                name: walletName,
                                publicKey: publicKey,
                                privateKey: privateKey,
                                balance: 0, // Assuming initial balance is 0
                                txns: { create: [] } // Assuming no initial transactions
                            }]
                        }
                    }
                },
                mainWallet: {
                    create: {
                        name: walletName,
                        publicKey: publicKey,
                        privateKey: privateKey,
                        balance: 0, // Assuming initial balance is 0
                        txns: { create: [] } // Assuming no initial transactions
                    }
                }
            }
        });

        res.status(201).json({
            message: 'User created',
            mnemonic: mnemonic,
            publicKey: publicKey,
            privateKey: privateKey
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Signup failed', details: error.message });
    } finally {
        await prisma.$disconnect();
    }
};

export const getDepositAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email: email },
            include: {
                mainWallet: true
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'Main wallet public key fetched successfully',
            publicKey: user.mainWallet.publicKey
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch main wallet public key', details: error.message });
    } finally {
        await prisma.$disconnect();
    }
};
