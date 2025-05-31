import mongoose from "mongoose";

import { dbConfig } from "../../config";

const dbConn = async () => {
    mongoose
        .connect(`${dbConfig.url}/${dbConfig.dbName}`, {})
        .then(() => {
            console.log("DB connected")
        })
        .catch((err: mongoose.Error) => {
            throw (err);
        });
};



export default dbConn;