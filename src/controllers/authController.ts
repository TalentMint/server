import { Request, Response } from "express";

import User from "../models/User";
import {
    errServer,
    getReqFields,
    isExpressResponse,
} from "../utils/reqResUtils";
import {
    deriveSalt,
    generateJwt,
    generateNonce,
    hash,
} from "../utils/cryptoUtils";
import { authConfig } from "../../config";
import { AuthRequest } from "../middlewares/types";
import { IUser } from "../models/types";
// import { validateGoogleIdToken } from "../utils/oAuthValidator";
// import { computeZkLoginAddress } from "@mysten/zklogin";

const generateAccessToken = (user: IUser) => {
    return generateJwt({ walletAddress: user.walletAddress });
};

export const zkGetNonce = async (req: Request, res: Response) => {
    const payload = getReqFields(req, res, {
        requiredParams: ["ephemeralPublicKey", "maxEpoch"],
    });
    if (isExpressResponse(payload)) {
        return;
    }
    const { ephemeralPublicKey, maxEpoch } = payload.params;
    const nonce = generateNonce(
        ephemeralPublicKey.toString(),
        Number(maxEpoch) || 1
    );

    return res.json({
        code: 0,
        data: { nonce },
    });
};

export const zkGetSalt = async (req: Request, res: Response) => {
    const payload = getReqFields(req, res, {
        requiredFields: ["provider", "providerUserId"],
    });
    if (isExpressResponse(payload)) {
        return;
    }
    const { provider, providerUserId } = payload.data;
    if (!authConfig.OAuthProviders.includes(provider)) {
        return res.status(400).json({
            code: 0,
            message: `OAuth provider: ${provider} not supported. Supported types: ${authConfig.OAuthProviders.join(
                ", "
            )}`,
        });
    }
    const salt = deriveSalt(provider, providerUserId);

    return res.json({
        code: 0,
        data: { salt },
    });
};

export const getWalletConnectMessage = async (req: Request, res: Response) => {
    const salt = await hash(`tm-${Date.now()}`);
    return res.json({
        code: 0,
        data: {
            salt,
        },
    });
};

export const loginViaConnectWallet = async (req: Request, res: Response) => {
    const payload = getReqFields(req, res, {
        requiredFields: ["walletAddress"],
    });
    if (isExpressResponse(payload)) {
        return;
    }
    const { walletAddress } = payload.data;

    console.log(walletAddress);

    try {
        let user = await User.findOne({ walletAddress });
        if (!user) {
            user = await User.create({
                walletAddress,
                userType: "creator",
                profile: {},
            });
        }
        return res.json({
            code: 0,
            data: {
                user,
                token: generateAccessToken(user),
            },
        });
    } catch (error) {
        // console.log(error);
        return res.send(errServer());
    }
};

export const createTestUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create({
            provider: "google",
            providerUserId: "atat",
            email: "ezetheophi05@gmail.com",
            walletAddress: "0x8b5acuienmcpokehbkie9bcjknksiisks7840kks",
            userType: "creator",
            userName: "captEze",
            profile: {
                firstName: "Eze",
                lastName: "Theophilus",
                age: 17,
                profileImage: "ddjdjjd",
                bio: "udidid",
            },
        });
        return res.json({
            user,
            token: generateAccessToken(user),
        });
    } catch (error) {
        console.log(error);
        return res.send(`Server ${error}`);
    }
};
