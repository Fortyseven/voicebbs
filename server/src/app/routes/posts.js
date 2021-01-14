const Post = require("../models/Post");
const { Router } = require("express");

const postsRouter = Router();

/*
    Retrieve all of the posts available for the front page, or replies given
    parent shortcode
*/
postsRouter.get("/posts/:parent?", (req, res) => {
    console.log(req.ip, "/posts", req.params.parent);

    let findby = {};

    if (req.params.parent) {
        findby.parent = req.params.parent;
    } else {
        // only return top-level posts
        findby.parent = {
            $eq: undefined,
        };
    }

    let query = Post.find(findby)
        .select("shortcode -_id")
        .sort([["timestamp", -1]]);

    var posts = query.exec((err, posts) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        if (!posts) {
            res.sendStatus(404);
            return;
        }
        res.json(posts);
    });
});

module.exports = {
    postsRouter,
};
