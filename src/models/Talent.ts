import { Schema, model } from "mongoose";
import { ITalent } from "./types";

const TalentSchema = new Schema<ITalent>(
    {
        name: {
            type: String,
            required: true,
        },
        walletAddress: {
            required: true,
            type: String,
        },  
        url: { 
            type: String,
            required: true 
        },
        publicID: { 
            type: String,
            required: true 
        },
        type: {
            type: String,
            enum: ["image", "video"],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default model<ITalent>("Talent", TalentSchema);
