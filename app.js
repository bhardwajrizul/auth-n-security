require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;

userSchema.plugin(encrypt, {secret : secret, encryptedFields: ["password"]});

const userModel = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new userModel({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(() => res.render("secrets"));
});
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userModel.findOne({email: username}, (err, userFound) => {
        if(err){
            console.log(err);
        }else{
            if(userFound){
                if(userFound.password === password)
                {
                    res.render("secrets");
                }
            }
        }
    });

});



let port = 3000;
app.listen(port, () => {
    console.log("Server Started at port: " + port)
});