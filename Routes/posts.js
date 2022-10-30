const express = require("express");
const router = express.Router();
const Post = require("../Models/postSchema");
const Profile = require("../Models/profileSchema");
const mongoose = require("mongoose");

router.post("/posts", async (req, res) => {

    const isLoggedIn = req.session.user ? true : false;
    if (isLoggedIn) {
        const currentId = await Profile.findOne({ email: req.session.user });
        const id = currentId._id.toString();
        const { title, description } = req.body;

        const p = await Post.create({
            user_id: id,
            title: title,
            description: description,
        });

        const x = p._id.toString();

        await Profile.updateOne({ _id: id }, { $push: { posts: { post_id: x } } });

        const result = {
            "Post Id": x,
            "Title": title,
            "Description": description
        }

        res.json(result);

    }
    else {
        res.json("Not logged in");
    }

});

router.delete("/posts/:id", async (req, res) => {

    const isLoggedIn = req.session.user ? true : false;
    if (isLoggedIn) {

        const findPost = await Post.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        if (findPost) {
            await Post.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            await Profile.updateOne({ email: req.session.user }, { $pull: { posts: { post_id: req.params.id } } })
            res.json("Post deleted");
        }
        else res.json("Incorrect ID!");

    }
    else {
        res.json("Not logged in");
    }
});

router.post("/like/:id", async (req, res) => {
    const isLoggedIn = req.session.user ? true : false;
    if (isLoggedIn) {
        const findPost = await Post.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        if (findPost) {
            const Id = await Profile.findOne({ email: req.session.user });
            const getId = Id._id.toString();

            var exists = 0;
            const x = await Post.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            for (let i = 0; i < x.likes.length; i++) {
                const like = x.likes[i];
                if (like.people == getId) {
                    exists = 1;
                    break;
                }
            }

            if (exists == 0) {
                await Post.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $push: { likes: { people: getId } } });
                res.json("Like added!");
            }
            else {
                res.json("Like has already been added!");
            }
        } else {
            res.json("Incorrect ID!");
        }
    } else {
        res.json("Not logged in");
    }
});

router.post("/unlike/:id", async (req, res) => {
    const isLoggedIn = req.session.user ? true : false;
    if (isLoggedIn) {
        const findPost = await Post.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        if (findPost) {
            const Id = await Profile.findOne({ email: req.session.user });
            const getId = Id._id.toString();

            var exists = 0;
            const x = await Post.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            for (let i = 0; i < x.likes.length; i++) {
                const like = x.likes[i];
                if (like.people == getId) {
                    exists = 1;
                    break;
                }
            }

            if (exists == 1) {
                await Post.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $pull: { likes: { people: getId } } });
                res.json("Like removed!");
            }
            else {
                res.json("No like present at this post");
            }
        } else {
            res.json("Incorrect ID!");
        }
    } else {
        res.json("Not logged in");
    }
});

router.post("/comment/:id", async (req, res) => {
    const isLoggedIn = req.session.user ? true : false;
    if (isLoggedIn) {
        const findPost = await Post.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

        if (findPost) {

            const content = req.body.content;
            const currUser = await Profile.findOne({ email: req.session.user });
            const getId = currUser._id.toString();
            await Post.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $push: { comments: { user_id: getId, name: req.session.name, comment: content } } });
            const comment_id = findPost.comments[findPost.comments.length - 1];
            const cId = comment_id._id.toString();
            res.json(cId);

        }
        else {
            res.json("Incorrect ID!");
        }
    } else {
        res.json("Not logged in");
    }
});

router.get("/posts/:id", async (req, res) => {
    const isLoggedIn = req.session.user ? true : false;
    if (isLoggedIn) {
        const getPost = await Post.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        if (getPost) {
            const result = {
                likes: getPost.likes.length,
                comments: getPost.comments
            }
            res.json(result);
        }
        else {
            res.json("Incorrect ID!");
        }
    } else {
        res.json("Not logged in");
    }
});

router.get("/all_posts", async (req, res) => {
    const isLoggedIn = req.session.user ? true : false;
    if (isLoggedIn) {
        const AllPosts = await Post.find();
        const results = [];
        for (let i = 0; i < AllPosts.length; i++) {
            const post = AllPosts[i];
            const comm = [];
            for (let j = 0; j < post.comments.length; j++) {
                const com = post.comments[j];
                const add = com.name + ": " + com.comment;
                comm.push(add);
            }
            const AddToArray = {
                id: post._id.toString(),
                title: post.title,
                description: post.description,
                created_at: post.createdAt,
                comments: comm,
                likes: post.likes.length
            }
            results.push(AddToArray);
        }
        res.json(results);
    }
    else {
        res.json("Not logged in");
    }
})

module.exports = router;