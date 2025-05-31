import { Schema, model } from "mongoose";

import { IUser, IUserProfile } from "./types";

const UserProfileSchema = new Schema<IUserProfile>(
    {
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        age: Number,
        profileImage: String,
        bio: String,
        location: String,
    },
    {
        _id: false,
    }
);

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: false,
            unique: true,
        },
        walletAddress: { type: String, required: true, unique: true },
        userType: {
            type: String,
            enum: ["creator", "collector"],
            required: true,
        },
        userName: { type: String, required: false, unique: true },
        profile: { type: UserProfileSchema, required: false },
    },
    { timestamps: true }
);

export default model<IUser>("User", UserSchema);
