const express = require("express");
const router = express.Router();
//var Chart = require('chart.js');
const { userAuthenticated } = require("../../helper/authentication");
//const faker=require('faker');
const Post = require("../../models/Post");
const Category = require("../../models/Category");
const Comment = require("../../models/Comment");
router.all("/*", userAuthenticated, (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});
router.get("/", (req, res) => {
  const promises = [
    Post.count().exec(),
    Category.count().exec(),
    Comment.count().exec()
  ];

  Promise.all(promises).then(([postCount, categoryCount, commentCount]) => {
    res.render("admin/index", {
      postCount: postCount,
      categoryCount: categoryCount,
      commentCount: commentCount
    });
  });
  // Post.find({ user: req.user.id })
  //   .populate("category")
  //   .then(posts => {
  //     res.render("admin/index", { posts: posts.count().exec() });
  //   });
});

/*router.post('/generate-fake-posts',(req,res)=>{
    for(let i=0 ; i < req.body.amount ; i++ ){
        let post = new Post();
            post.title = faker.name.title();
            post.status = 'public';
           
            post.allowComments = faker.random.boolean();
            post.body = faker.lorem.sentence();
   post.save(function(err){
    if(err) {
        throw err;
    }
   });
    
    }
    res.redirect('/admin/posts');
    //res.send("It works");
});*/

module.exports = router;
