const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
const adminLogin = require('../helpers/admin-helper')

let admin_Header = true;

const verifylogin = (req, res, next) => {
  if (req.session.admin) {
    next()
  }
  else {
    res.redirect('admin-login')
  }
}


// admin login...
router.get('/admin-login', (req, res) => {
  if (req.session.admin) {
    res.redirect('/')
  }
  else {
    res.render('admin/login', { admin_Header, 'adminLoginErr' : req.session.adminLoginError })
    req.session.adminLoginError = false;
  }

})

router.post('/admin-login', (req, res) => {
  // console.log(req.body);
  adminLogin.doLoginAdmin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response;
      console.log(req.session.admin);
      req.session.admin.loggedIn = true;
      res.redirect('/admin')
    }

  }).catch((err) => {
    console.log(err);
    req.session.adminLoginError = "Invalid Admins Username or Password"
    res.redirect('admin-login')
  })

})


/* GET users listing. */
router.get('/', function (req, res, next) {

  if (req.session.admin) {
    let admin = req.session.admin;
    productHelper.getAllProducts().then((products) => {
      res.render('admin/view-products', { admin_Header, admin, products });
    })
  }
  else{
    res.redirect('admin/admin-login')
  }



});

router.get('/add-product', verifylogin, (req, res) => {
  let admin = req.session.admin;
  res.render('admin/add-product', { admin_Header, admin })
})

router.post('/add-product', (req, res) => {
  // console.log(req.body);
  // console.log(req.files.image);
  productHelper.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product', { admin_Header });
      }
      else {
        console.log(err);
      }
    })

  })
})

router.get('/delete-product/:id', (req, res) => {
  let prodId = req.params.id
  console.log(prodId);
  productHelper.deleteProduct(prodId).then((response) => {
    res.redirect('/admin')
  })
})

router.get('/edit-product/:id', async (req, res) => {
  if(req.session.admin){
    let admin = req.session.admin;
  let product = await productHelper.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product', { admin_Header, admin, product })
  }
  else{
    res.redirect('/admin')
  }
})

router.post('/edit-product/:id', (req, res) => {
  
  productHelper.updateProduct(req.params.id, req.body).then(() => {
    let id = req.params.id;
    res.redirect('/admin')
    if (req.files) {
      let image = req.files.image
      image.mv('./public/product-images/' + id + '.jpg')

    }
  })
})

router.get('/admin-logout', (req, res) => {
  req.session.admin = null;
  res.redirect('admin-login')
})

module.exports = router;
