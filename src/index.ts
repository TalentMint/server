import express from "express";
import Formidable from "express-formidable";
import cors from "cors";
import router from "./routes";

const app = express();
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow all origins that send requests
            callback(null, origin || "*");
        },
        credentials: true,
    })
);
app.use(Formidable());
app.disable("x-powered-by");

app.get("/", (req, res) => {
    res.send("index");
});
app.use("/api/v1", router);

export default app;
