require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session');
const passport = require('passport');

const port = process.env.PORT || 3000
global.cart = []

const productRoutes = require('./routes/productRoute')
const cartRoutes = require('./routes/cartRoute')
const userRoutes = require('./routes/userRoute')
const sellRoutes = require('./routes/sellRoute')


const productModel = require('./models/product')

//mongoose
const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URL;
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () =>
      console.log(`Connection is established and running on port: ${port}`)
    )
  )
  .catch((err) => console.log(err.message));

app.set('view engine', 'pug')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
require ('./middleware/passport')(passport);

app.use('/products', productRoutes)
app.use('/cart', cartRoutes)
app.use('/user', userRoutes)
app.use('/sell', sellRoutes)

app.get('/', async (req, res) => {
  const featuredProducts = await productModel.aggregate([{ $sample: { size: 3 } }])
  res.render('index', { featuredProducts: featuredProducts, cart});
});

app.get('/error', (req, res) => {
  res.render('error', {cart});
});

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next('err');
});
app.use(function (err, req, res, next) {
  console.log(err)
  const errorMessage = 'Not Found'
  res.status(404 || 500).render('error', { cart, errorMessage });
});

