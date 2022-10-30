const express = require("express");
const router = express.Router();
const Profile = require("../Models/profileSchema");
const jwt = require("jsonwebtoken");

router.post("/authenticate", async (req, res) => {

    const { email, password } = req.body;
    const user = { email: email };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    const profile = await Profile.findOne({ email });
    if (profile && (await profile.matchPassword(password))) {
        req.session.user = email;
        req.session.name = profile.name;
        res.json(accessToken + " -> " + email);
    }
    else {
        res.json("Invalid Credentials");
    }

});

module.exports = router;