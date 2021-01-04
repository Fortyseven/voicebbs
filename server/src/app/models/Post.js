const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PostSchema = new Schema({
    shortcode: String,
    timestamp: Schema.Types.Date,
    duration: Number,
    ip: String,
    _replyto_id: Schema.Types.ObjectId,
    blob: Object,
});

module.exports = mongoose.model("Post", PostSchema);
