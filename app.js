//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Mongo Connection
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});
//Schema
const articleSchema = {
    title: String,
    content: String,
};

// @ts-ignore
const Article = mongoose.model("Article", articleSchema);
//GET
app.get("/articles",(req,res) => {
    Article.find((err,foundItems)=>{
        if (err) throw err;
        res.send(foundItems);
    });
});

app.post("/articles", (req,res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(err => {
        if (err) {
            res.send(err);
        }else {
            res.send("Successfullyy added a new article")
        }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});