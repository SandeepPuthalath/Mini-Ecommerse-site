var express = require('express');
const { response } = require('../app');
var router = express.Router();
const productHelper = require('../helpers/product-helpers')
const userHelper = require('../helpers/user-helper')

/* GET home page. */
const verifylogin = (req, res, next) =>{
  if(req.session.user){
    next()
  }
  else{
    res.redirect('/login')
  }
}

router.get('/', function (req, res, next) {
  let user = req.session.user;

  productHelper.getAllProducts().then((products) => {

    res.render('user/view-products', { products, user });
 
  })

});

// login form...
router.get('/login', (req, res) => {
  if(req.session.user){
    res.redirect('/')
  }
  else{
  res.render('user/login',{'loginError' :req.session.userLoginError})
  req.session.userLoginError = false;
  }
})

//signup form...
router.get('/signup', (req, res) => {
  if(req.session.user){
    res.redirect('/')
  }
  else{
  res.render('user/signup',{"userExists" :req.session.userExists})
  req.session.userExists = false;
  }
})


router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((response) => {
    req.session.user = response;
    req.session.user.loggedIn = true;
    res.redirect('/');
  }).catch((err) =>{
    req.session.userExists = 'User already exists'; 
    res.redirect('/signup')
  })
})

router.get('/cart',verifylogin,(req, res) =>{
  let user = req.session.user;
  res.render('user/user-cart',{user})
})

router.post('/login', (req, res) => {
  console.log(req.body)
  userHelper.doLogin(req.body).then((response) =>{
    if(response.status){
      req.session.user = response.user;
      req.session.user.loggedIn = true;
      res.redirect('/')
    }
    else{
      req.session.userLoginError = 'Invalid Email or Password ';
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req, res) =>{
  req.session.user = null;
  res.redirect('/');
})

module.exports = router;