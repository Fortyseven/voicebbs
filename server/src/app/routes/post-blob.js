const Post = require("../models/Post");
const { Router } = require("express");

const postBlobRouter = Router();

/**********************************************************/
postBlobRouter.get("/post-blob/:shortcode", function (req, res) {
    let query = Post.findOne({ shortcode: req.params.shortcode }).select("blob -_id");

    query.exec((err, post) => {
        if (err) {
            res.json({ message: "error pulling blob" });
        }
        res.json(post);
    });
});

module.exports = {
    postBlobRouter,
};
