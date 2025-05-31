#!/usr/bin/env node
import http from "http";
import morgan from "morgan";
import app from "../src";
import { appConfig } from "../config";

import dbConn from "../src/db/conn";

app.use(morgan("dev"));
const server = http.createServer(app);


dbConn()
    .then(() => {
        server.listen(appConfig.port, () => {
            console.log(`App on ${appConfig.port}`);
        });
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
