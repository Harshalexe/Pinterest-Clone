var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./post")
const { upload, upload1 } = require("./multer")
const passport = require('passport')
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile',isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({
      username:req.session.passport.user
  })
  .populate('posts')
  res.render('profile',{user});
});

router.get('/profile2/:userId',isLoggedIn,async function(req, res, next) {
  const user1 = req.params.userId
  const user = await userModel.findById(user1).populate('posts');
  res.render('profile2',{user});
})

router.get('/feed',isLoggedIn,async function(req, res, next) {
  const allPosts = await postModel.find({})
                                    .populate({
                                      path: 'user', 
                                      select: 'dp username' 
                                    })
  res.render('feed',{allPosts})
});

router.get('/coll',isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({
      username:req.session.passport.user
  })
  .populate('posts')
  res.render('coll',{user});
});

router.get('/coll2/:userId',isLoggedIn,async function(req, res, next) {
  const user1= req.params.userId
  const user = await userModel.findById(user1).populate('posts');
  res.render('coll',{user});
});

router.post('/upload',isLoggedIn,upload.single('file'), async function(req, res, next) {
  if(!req.file){
    return res.status(400).send('No file were uploaded.')
  }
  const user = await userModel.findOne({username: req.session.passport.user})
  const post = await postModel.create({
    image:req.file.filename,
    postText:req.body.filecaption,
    user:user._id
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect('/profile')
});

router.post('/uploadprofilepic',isLoggedIn,upload1.single('image'), async function(req,res,next){
  const user= await userModel.findOne({username:req.session.passport.user})
  user.dp= req.file.filename
  await user.save()
  res.redirect('/profile')
})

router.get('/login', function(req, res, next) {
  res.render('login',{error:req.flash('error')})
});

router.post('/register',function(req,res){
  const {username, email, fullname}= req.body;
  const userData = new userModel({username, email, fullname})
  userModel.register(userData, req.body.password)
  .then( function(registereduser){
    passport.authenticate("local")(req,res, function(){
      res.redirect('/profile');
    })
  })
})

router.post('/login',passport.authenticate('local',{
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash:true
}),function(req,res){ })

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err) return next(err)
    res.redirect('/login')
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}

module.exports = router;
