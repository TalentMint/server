import { Request, Response } from "express";
import {
    errServer,
    getReqFields,
    isExpressResponse,
} from "../utils/reqResUtils";

import Talent from "../models/Talent";
import { AuthRequest } from "../middlewares/types";

import cloudinary from "../utils/cloudinary";

import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
// import { RawSigner } from "@mysten/sui/signers/raw-signer";
import { Transaction } from "@mysten/sui/transactions";

export const createTalent = async (req: AuthRequest, res: Response) => {
    const payload = getReqFields(req, res, {
        requiredFields: ["name", "quantity", "description", "value"],
        requiredFiles: ["media"],
    });

    if (isExpressResponse(payload)) {
        return;
    }

    let { name, quantity, description, value } = payload.data;

    value = parseFloat(value);
    quantity = parseInt(quantity);

    if (!value)
        return res.status(400).json({
            code: 3,
            message: "Invalid Talent Value",
        });
    if (!quantity)
        return res.status(400).json({
            code: 3,
            message: "Invalid Talent quantity",
        });
    const { media } = payload.files;

    let uploadedMedia;
    try {
        uploadedMedia = await cloudinary.uploader.upload(media.path, {
            resource_type: "auto",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json(errServer());
    }

    try {
        const newTalent = await Talent.create({
            name,
            quantity,
            description,
            value,
            walletAddress: req.user?.walletAddress,
            publicID: uploadedMedia.public_id,
            url: uploadedMedia.url,
            type: uploadedMedia.resource_type,
        });
        return res.status(201).json({
            code: 0,
            data: newTalent,
            message: "Talent created successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(errServer());
    }
};

export const fetchTalents = async (req: AuthRequest, res: Response) => {
    try {
        const talents = await Talent.find({
            walletAddress: req.user.walletAddress,
        }).select("-__v -createdAt -updatedAt");
        return res.json({
            code: 0,
            data: talents,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(errServer());
    }
};

export const getTalentDetails = async (req: AuthRequest, res: Response) => {
    const { talentID } = req.params;
    try {
        const talent = await Talent.findById(talentID).select("-__v");
        if (!talent)
            return res.status(404).json({
                code: 4,
                message: `Invalid talent ID: ${talentID}`,
            });
        return res.json({
            code: 0,
            data: talent,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(errServer());
    }
};

export const mintTalent = async (req: AuthRequest, res: Response) => {
    const { talentID } = req.params;

    try {
        const talent = await Talent.findById(talentID);
        if (!talent)
            return res.status(404).json({
                code: 4,
                message: `Invalid talent ID: ${talentID}`,
            });

        if (talent.quantity <= 0)
            return res.status(404).json({
                code: 4,
                message: `Talent out of quantity ${talentID}`,
            });

        // smart contract interaction

        talent.quantity -= 1;
        await talent.save();
        return res.json({
            code: 0,
            message: `Minted successfully to wallet ${req.user.walletAddress}`,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(errServer());
    }
};
