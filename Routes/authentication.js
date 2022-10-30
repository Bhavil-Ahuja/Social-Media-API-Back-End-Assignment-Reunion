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

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        res.json("Invalid credentials");
    }
    const user = await Profile.create({
        name: name,
        email: email,
        password: password
    });
    if (user) {
        req.session.user = email;
        req.session.name = name;
    } else {
        res.status(400);
        res.json("Profile creation unsuccessful!");
    }
});

module.exports = router;