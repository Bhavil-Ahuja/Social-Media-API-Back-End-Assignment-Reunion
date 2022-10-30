const express = require("express");
const port = 3000 || process.env.PORT;
const session = require("express-session")
const { v4: uuidv4 } = require("uuid")
const authentication = require("./Routes/authentication");
const follow_unfollow = require("./Routes/follow_unfollow");
const posts = require("./Routes/posts");
const viewProfile = require("./Routes/viewProfile");
const app = express();

const connectDb = require("./Config/db");
connectDb();

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use("/api", authentication);
app.use("/api", follow_unfollow);
app.use("/api", posts);
app.use("/api", viewProfile);

app.get("/api", (req, res) => {
    res.send("<h1>Hey there!</h1>");
});

app.listen(port, () => {
    console.log("Server started!");
});