const express = require("express");
const router = express.Router();
const Profile = require("../Models/profileSchema");
const mongoose = require("mongoose");

router.post("/follow/:id", async (req, res) => {

    const isLoggedIn = req.session.user ? true : false;

    if (isLoggedIn) {

        const currentId = await Profile.findOne({ email: req.session.user });
        const currentId1 = currentId._id.toString();

        const check = await Profile.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        var present = 0;
        for (let i = 0; i < check.followers.length; i++) {
            const f = check.followers[i];
            if (f.id == currentId1) {
                present = 1;
                break;
            }
        }
        if (present == 1) {
            res.json("You already follow the person");
        }

        else {

            await Profile.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $push: { followers: { id: currentId1 } } });
            await Profile.updateOne({ _id: mongoose.Types.ObjectId(currentId1) }, { $push: { following: { id: req.params.id } } });
            res.json("Follower added");
        }
    }
    else {
        res.json("Not logged in");
    }

});

router.post("/unfollow/:id", async (req, res) => {

    const isLoggedIn = req.session.user ? true : false;
    if (isLoggedIn) {

        const currentId = await Profile.findOne({ email: req.session.user });
        const currentId1 = currentId._id.toString();

        const check = await Profile.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

        var present = 0;
        for (let i = 0; i < check.followers.length; i++) {
            const f = check.followers[i];
            if (f.id == currentId1) {
                present = 1;
                break;
            }
        }

        if (present == 1) {
            await Profile.updateOne({ _id: mongoose.Types.ObjectId(currentId1) }, { $pull: { following: { id: req.params.id } } });
            await Profile.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $pull: { followers: { id: currentId1 } } });
            res.json("Follower removed!");
        }
        else {
            res.json("You do not follow the person");
        }
    }
    else {
        res.json("Not logged in");
    }

});

module.exports = router;