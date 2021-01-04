/**
 * VOICE BBS nodejs server
 * fortyseven@network47.xyz
 * 2021-01-02
 */

const express = require("express");
const routes = require("./app/routes/");

/***************************************************************/
function mongoInit() {
    const mongoose = require("mongoose");

    const MONGO_CONN = process.env.VBBS_MONGO_CONN;

    if (!MONGO_CONN) {
        console.error("MONGO_CONN connection string not defined");
        process.exit(1);
    }

    mongoose.connect(MONGO_CONN, { useNewUrlParser: true, useUnifiedTopology: true });
}

/***************************************************************/
function expressInit(routes) {
    const bodyParser = require("body-parser");
    const fs = require("fs");

    const key_path = process.env.VBBS_SSL_KEY_FILE;
    const crt_path = process.env.VBBS_SSL_CRT_FILE;

    if (!key_path || !fs.existsSync(key_path)) {
        console.error("SSL_KEY_FILE not defined");
        process.exit(1);
    }
    if (!crt_path || !fs.existsSync(crt_path)) {
        console.error("SSL_CRT_FILE not defined");
        process.exit(1);
    }

    const privateKey = fs.readFileSync(key_path, "utf8");
    const certificate = fs.readFileSync(crt_path, "utf8");

    const credentials = { key: privateKey, cert: certificate };

    const https = require("https");

    const app = express();
    const app_https = https.createServer(credentials, app);

    const port = process.env.VBBS_PORT || 5050;

    const cors_host = process.env.VBBS_CORS_HOST;
    if (!cors_host) {
        console.error("CORS_HOST not defined");
        process.exit(1);
    }
    console.log(`CORS_HOST=${cors_host}`);
    //CORS middleware
    const corsMiddleware = function (req, res, next) {
        res.header("Access-Control-Allow-Origin", cors_host); //replace localhost with actual host
        res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, PATCH, POST, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Authorization");

        next();
    };

    app.use(corsMiddleware);

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    const router = express.Router();
    for (let i in routes) {
        app.use("/api/v1", routes[i]);
    }
    return [app_https, port];
}

const [app, port] = expressInit(routes);
mongoInit();

app.listen(port, () => {
    console.log(`- Listening on ${port}`);
});
