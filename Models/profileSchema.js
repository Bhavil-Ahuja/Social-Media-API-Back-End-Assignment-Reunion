const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const profileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        followers: [{
            id: {
                type: String,
            }
        }],
        following: [{
            id: {
                type: String,
            }
        }],
        posts: [{
            post_id: {
                type: String,
            }
        }]
    }
);

profileSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

profileSchema.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

module.exports = mongoose.model("Profile", profileSchema);