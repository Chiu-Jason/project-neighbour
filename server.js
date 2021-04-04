const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = 3000

app.set('view engine', 'pug')
app.use(express.static('public'))

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
const mongoDB = 'mongodb://127.0.0.1:27017/neighbour'
mongoose.connect(mongoDB, { useNewUrlParser: true});
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const productsSchema = new mongoose.Schema({
    city: String,
    category: String,
    name: String,
    description: String,
    price: Number,
    image: String
});
const productModel = mongoose.model('productModel', productsSchema);

const cart = []

app.get('/', async (req, res) => {
    const featuredProducts = await productModel.aggregate([{ $sample: { size: 3 } }])
    res.render('index', { featuredProducts: featuredProducts, cart});
});
app.get('/sell', (req, res)=>{
    res.render('sell', {cart});
});
app.get('/products/', async (req, res)=>{
    const products = await productModel.find().exec();
    res.render('products', { products: products, cart})
});
app.get('/products/:id', async (req, res, next) => {
    const selectedId = req.params.id
    const product = await productModel.findOne({ "_id": selectedId });
    if (!product){
        next('err')
    }
    res.render('details', { product: product, cart })
})
app.get('/products/city/:city', async (req, res, next)=>{
    const selectedCity = req.params.city
    let selectedProducts = await productModel.find({"city": selectedCity}).exec();
    if (!selectedProducts){
        next('err')
    }
    res.render('products', { products: selectedProducts, cart });
});
app.get('/products/category/:category', async (req, res, next)=>{
    const selectedCategory = req.params.category
    let selectedProducts = await productModel.find({"category": selectedCategory})
    if (!selectedProducts){
        next('err')
    }
    res.render('products', { products: selectedProducts, cart });
});
app.post('/sell', upload.single('image'), async (req, res) => {
    const newItem = {
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
app.get('/cart/', (req, res)=>{
    const subtotal = cart.reduce((acc, curr)=> acc + curr.price,0);
    let tax = subtotal * 0.12;
    parseFloat(tax).toFixed(2);
    let total = subtotal + tax;
    parseFloat(total).toFixed(2);
    res.render('cart', { cart: cart, subtotal, tax, total})
})
app.get('/cart/:id', async (req, res, next) => {
    const selectedId = req.params.id
    const item = await productModel.findOne({"_id": selectedId }).exec();
    if (!item){
        next('err')
    }
    cart.push(item); 
    res.redirect('/products');
})
app.get('/cart/delete/:id', (req, res, next)=>{
    const itemIndex = cart.findIndex(p => p.id == req.params.id)
    cart.splice(itemIndex, 1);
    res.redirect('/cart/');
})
app.use(function(req, res, next){
    const err = new Error('Not Found');
    err.status = 404;
    next('err');
});
app.use(function(err, req, res, next){
    res.status(404 || 500).render('error',{cart});
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
