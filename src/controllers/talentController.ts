import { Request, Response } from "express";
import {
    errServer,
    getReqFields,
    isExpressResponse,
} from "../utils/reqResUtils";

import Talent from "../models/Talent";
import { AuthRequest } from "../middlewares/types";

import cloudinary from "../utils/cloudinary";

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

    const uploadedMedia = await cloudinary.uploader
        .upload(media.path, {
            resource_type: "auto",
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(errServer());
        });

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
        return res.status(500).json({
            code: 99,
            message: "Unable to create Talent, please try again!",
        });
    }
};
