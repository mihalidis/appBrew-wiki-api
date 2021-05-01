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
// chainer route handlers using express
app.route('/articles')
    .get(
        (req,res) => {
            Article.find((err,foundItems)=>{
                if (err) throw err;
                res.send(foundItems);
            });
        }
    )
    .post(
        (req,res)=>{
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
        }
    )
    .delete(
        (req,res)=>{
            Article.deleteMany(err => {
                if(!err){
                    res.send("All articles are deleted");
                }else {
                    res.send(err);
                }
            });
        }
    );
// request targeting spesific article
app.route("/articles/:articleTitle")
    .get((req,res)=>{
        Article.findOne({title : req.params.articleTitle}, (err,result)=>{
           if (err) throw err;
           res.send(result); 
        });
    })
    .put((req,res)=>{
        Article.updateOne(
            {title : req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (err) => {
                if(!err){
                    res.send("successfully updated :)")
                }else {
                    res.send(err);
                }
            }
        );
    })
    .patch((req,res)=>{
        Article.updateOne(
            {title : req.params.articleTitle},
            {$set: req.body},
            (err) => {
                if(!err){
                    res.send("successfully updated :)")
                }else {
                    res.send(err);
                }
            }
        );
    })
    .delete((req,res)=>{
        Article.findOneAndDelete(
            {title : req.params.articleTitle},
            (err) => {
                if(!err){
                    res.send("successfully deleted :)")
                }else {
                    res.send(err);
                }
            }
        );
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});