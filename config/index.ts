import dotenv from "dotenv";
dotenv.config();
import { AppConfig } from "./types";

export const appConfig: AppConfig = {
    port: process.env.APP_PORT || 5000,
    jwtSecret: process.env.JWT_KEY || "insecure",
    jwtExpiry: "1d",
};

export const dbConfig = {
    url: process.env.DB_URL,
    dbName: process.env.DB_NAME,
};

export const authConfig = {
    OAuthProviders: process.env.OAuthProviders?.replace(/\s/g, "").split(
        ","
    ) || ["apple", "google"],
};

export const cloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
};

export const smartcontractConfig = {
    objectID: process.env.CONTRACT_OBJECT_ID
}