const Post = require("../models/Post");
const { Router } = require("express");

const postsRouter = Router();

/*
    Retrieve all of the posts available for the front page
*/
postsRouter.get("/posts", (req, res) => {
    let query = Post.find({})
        .select("_id")
        .sort([["timestamp", -1]]);

    var posts = query.exec((err, posts) => {
        if (err) {
            res.json({ message: "error polling posts" });
        }
        res.json(posts);
    });
});

module.exports = {
    postsRouter,
};
