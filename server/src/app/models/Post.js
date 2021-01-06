const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PostSchema = new Schema({
    shortcode: String,
    timestamp: Schema.Types.Date,
    duration: Number,
    play_count: { type: Number, default: 0 },
    ip: String,
    _replyto_id: { type: Schema.Types.ObjectId, default: undefined },
    blob: Object,
});

module.exports = mongoose.model("Post", PostSchema);
