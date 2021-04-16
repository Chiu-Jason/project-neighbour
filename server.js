require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = process.env.PORT || 3000
global.cart = []

app.set('view engine', 'pug')
app.use(express.static('public'))

const productRoutes = require('./routes/productRoute.js')
const cartRoutes = require('./routes/cartRoute')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/image/product')
    },
    filename: function(req, file, cb){
        cb(null, req.body.name.toLowerCase() + '.jpeg')
    }
})
const upload = multer({storage: storage})

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


const productModel = require('./models/product')


app.get('/', async (req, res) => {
    const featuredProducts = await productModel.aggregate([{ $sample: { size: 3 } }])
    res.render('index', { featuredProducts: featuredProducts, cart});
});
app.get('/sell', (req, res)=>{
    res.render('sell', {cart});
});

app.post('/sell', upload.single('image'), async (req, res) => {
    const newItem = {
        _id: new mongoose.Types.ObjectId,
        city: req.body.city,
        category: req.body.category,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.file.filename
    }
    await productModel.create(newItem)
    res.redirect('/products');
})

app.use('/products', productRoutes)
app.use('/cart', cartRoutes)

app.use(function(req, res, next){
    const err = new Error('Not Found');
    err.status = 404;
    next('err');
});
app.use(function(err, req, res, next){
    res.status(404 || 500).render('error',{cart});
});

