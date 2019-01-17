const express=require('express');
const router=express.Router();
const Post=require('../../models/Post');
const Category=require('../../models/Category');
const fs =require('fs');
//const quill=require('quill');
const {generateDate}=require('../../helper/handlebars-helper');
const { isEmpty,uploadDir }=require('../../helper/upload-helper');
const {  userAuthenticated }=require('../../helper/authentication');
router.all("/*",(req,res,next)=>{
    req.app.locals.layout='admin';
    next();
})

router.get('/',(req,res)=>{
    
    Post.find({}).populate('category').then(posts=>{
        res.render('admin/posts/index',{posts:posts});
    })
    
});

router.get('/my-posts',(req,res)=>{
    
    Post.find({user:req.user.id}).populate('category').then(posts=>{
        res.render('admin/posts/my-posts',{posts:posts});
    })
    
});


router.get('/create',(req,res)=>{
    
    Category.find({}).then(categories=>{
        res.render('admin/posts/create',{categories:categories});
    });

   
});

router.post('/create',(req,res)=>{
    //console.log(req.files);
    let filename = '';
    if(!isEmpty(req.files)){
        let file=req.files.file;
         filename=Date.now()+'-'+ file.name;
        file.mv('./public/uploads/' + filename , (err)=>{
            if(err) throw err;
        });
       // console.log("Is not Empty");
    }
    
  
    let allowComments= true;
    if(req.body.allowComments){
        allowComments=true;
    }
    else{
        allowComments=false;
    }
    //var delta=editor.getContents();
 // console.log(req.body.editor.getContents());
   const newPost=new Post({

        user:req.user.id,
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.editor,
        //body:req.body.editor.getContents(),
        category:req.body.category,
        file:filename
 });
        newPost.save().then(savedPost=>{
            req.flash('success_message',`Post was created successfully`  );
            //console.log(savedPost);
        res.redirect('/admin/posts');
    }).catch(error=>{
        console.log("not saved");
    });
   
    console.log("My test");
   // res.send('Worked');
});
router.get('/edit/:id',(req,res)=>{
    Post.findOne({_id:req.params.id}).then(post=>{
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit',{post:post,categories:categories});
        });
        //res.render('admin/posts/edit',{post:post});
    });
    
    
});
router.put('/edit/:id',(req,res)=>{
    Post.findOne({_id: req.params.id})

        .then(post=>{
            if(req.body.allowComments){
                allowComments = true;
            } else{
                allowComments = false;
            }

            post.user = req.user.id;
            post.title = req.body.title;
            post.status = req.body.status;
            post.allowComments = allowComments;
            post.body = req.body.body;
            post.category = req.body.category;


            if(!isEmpty(req.files)){
                let file=req.files.file;
                 filename=Date.now()+'-'+ file.name;
                 post.file=filename;
                file.mv('./public/uploads/' + filename , (err)=>{
                    if(err) throw err;
                });
               // console.log("Is not Empty");
            }
           
            //post.category = req.body.category;


            post.save().then(updatedPost=>{
                req.flash('success_message',`Post was updated successfully`  );
            res.redirect('/admin/posts/my-posts');
            });


    //res.send("It Works");
});
});
router.delete('/:id',(req,res)=>{
    Post.findOne({_id:req.params.id}).populate('comments').then(post=>{
        fs.unlink(uploadDir + post.file,(err)=>{
            
            //console.log(post.comments);
            if(!post.comments.length < 1)
            {
                post.comments.forEach(comment=>{
                    comment.remove();
                });
            }

            post.remove().then(postRemoved=>{
                req.flash('success_message',`Post was successfully deleted`  );
                res.redirect('/admin/posts/my-posts');
            });
           

        });
        
    });
    
    
});
module.exports=router;