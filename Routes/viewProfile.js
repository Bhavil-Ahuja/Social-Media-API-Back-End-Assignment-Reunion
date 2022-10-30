const express = require("express");
const router = express.Router();
const Profile = require("../Models/profileSchema");

router.get("/user", async (req, res) => {
    const isLoggedIn = req.session.user ? true : false;
    if (isLoggedIn) {
        const getUser = await Profile.findOne({ email: req.session.user });
        const userData = {
            "User Name": req.session.name,
            "Number of followers": getUser.followers.length,
            "Number of following": getUser.following.length
        }
        res.json(userData);
    }
    else {
        res.json("Not logged in");
    }
});

module.exports = router;