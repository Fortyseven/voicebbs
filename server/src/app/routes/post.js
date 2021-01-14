const Post = require("../models/Post");
const { Router } = require("express");
const crypto = require("crypto");
const shortcode = require("short-unique-id");
const postRouter = Router();

var uid = new shortcode.default();

/**********************************************************
 * Inserts a newly recorded post
 *
 */

postRouter.put("/post", function (req, res) {
    if (!req.body.blob) {
        res.sendStatus(500);
        console.error("ERROR: No blob supplied");
        return;
    }
    var post = new Post();
    post.timestamp = new Date();
    post.duration = req.body.duration;
    post.ip = req.ip;
    post.blob = req.body.blob;
    post.shortcode = uid();
    if (req.body.reply_to) {
        post.parent = req.body.reply_to;
    }

    post.save((err) => {
        if (err) {
            res.sendStatus(err);
            return;
        }
        if (req.body.reply_to) {
            // increment reply count on parent
            Post.findOneAndUpdate({ shortcode: req.body.reply_to }, { $inc: { reply_count: 1 } }).exec();
        }
        res.json({ message: "ok" });
    });

    console.log(`${req.ip} -- Created post object from ${post.blob.length} bytes`);
});

/**********************************************************/
postRouter.get("/post/:shortcode?", function (req, res) {
    console.log(req.ip, `GET /post/${req.params.shortcode}`);

    Post.findOne({ shortcode: req.params.shortcode }, { _id: 0, blob: 0, __v: 0 }, (err, doc) => {
        if (doc) {
            doc._doc.ip_hash = crypto
                .createHash("sha256") // TODO: salt this? does it matter?
                .update(doc.ip || "0.0.0.0")
                .digest("hex");

            doc.ip = undefined;

            res.json(doc);
        } else {
            res.sendStatus(404);
        }
    });
});

module.exports = {
    postRouter,
};
