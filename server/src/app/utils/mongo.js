module.exports = function init() {
    const mongoose = require("mongoose");

    const MONGO_CONN = process.env.VBBS_MONGO_CONN;

    if (!MONGO_CONN) {
        console.error("MONGO_CONN connection string not defined");
        process.exit(1);
    }

    mongoose.connect(MONGO_CONN, { useNewUrlParser: true, useUnifiedTopology: true });
};
