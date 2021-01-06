const Post = require("../models/Post");
const { Router } = require("express");
const crypto = require("crypto");
const shortcode = require("short-unique-id");
const postRouter = Router();

var uid = new shortcode.default();

/**********************************************************/
postRouter.put("/post", function (req, res) {
    if (!req.body.blob) {
        res.sendStatus(500);
        console.error("ERROR: No blob supplied");
        return;
    }
    var post = new Post();
    post.name = "Unnamed Post";
    post.timestamp = new Date();
    post.duration = req.body.duration || "??";
    post.ip = req.ip;
    post.blob = req.body.blob;
    post.shortcode = uid();

    post.save((err) => {
        if (err) {
            res.sendStatus(err);
            return;
        }
        res.json({ message: "ok" });
    });

    console.log(`${req.ip} -- Created post object from ${post.blob.length} bytes`);
});

/**********************************************************/
postRouter.get("/post/:shortcode", function (req, res) {
    console.log(req.ip, `GET /post/${req.params.shortcode}`);
    let query = Post.findOne({ shortcode: req.params.shortcode }).select("timestamp duration ip shortcode");

    query.exec((err, post) => {
        if (err) {
            res.json({ message: "error polling posts" });
        }

        if (post) {
            // swap the ip out for a hash of it

            post._doc.ip_hash = crypto
                .createHash("sha256") // TODO: salt this? does it matter?
                .update(post.ip || "0.0.0.0")
                .digest("hex");

            post.ip = undefined;

            res.json(post);
        } else {
            res.sendStatus(404);
        }
    });
});

module.exports = {
    postRouter,
};
