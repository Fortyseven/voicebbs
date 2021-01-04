const Post = require("../models/Post");
const { Router } = require("express");

const postBlobRouter = Router();

/**********************************************************/
postBlobRouter.get("/post-blob/:post_id", function (req, res) {
    let query = Post.findById(req.params.post_id).select("blob -_id");

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
