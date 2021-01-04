const Post = require("../models/Post");
const { Router } = require("express");

const postRouter = Router();

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
postRouter.get("/post/:post_id", function (req, res) {
    let query = Post.findById(req.params.post_id).select("_id name timestamp duration");

    query.exec((err, posts) => {
        if (err) {
            res.json({ message: "error polling posts" });
        }
        res.json(posts);
    });
});

module.exports = {
    postRouter,
};
