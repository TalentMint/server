import { Document, Schema } from "mongoose";

export type TUserTypes = "collector" | "creator";
export interface IUserProfile {
    firstName: string;
    lastName: string;
    age?: number;
    profileImage?: string;
    bio?: string;
    location?: string;
    [key: string]: any;
}

export interface IUser extends Document {
    email?: string;
    walletAddress: string;
    userType: TUserTypes;
    userName: string;
    profile: IUserProfile;
    createdAt: Date;
    updatedAt: Date;
}

export type TTalentTypes = "image" | "video";

export interface ITalent extends Document {
    name: string;
    walletAddress: string;
    url: string;
    publicID: string;
    type: TTalentTypes;
    quantity: number;
    description: string;
    value: number;
    createdAt: Date;
    updatedAt: Date;
}
