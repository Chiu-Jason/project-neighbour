const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = 3000

app.set('view engine', 'pug')
app.use(express.static('public'))

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
    console.log('featured products:', featuredProducts)
    res.render('index', { featuredProducts: featuredProducts, cart});
});
app.get('/sell', (req, res)=>{
    res.render('sell', {cart});
});
app.get('/products/', async (req, res)=>{
    const products = await productModel.find().exec();
    console.log("documents:", products)
    res.render('products', { products: products, cart})
});
app.get('/products/:id', async (req, res) => {
    const selectedId = req.params.id
    const product = await productModel.findOne({ "_id": selectedId });
    console.log(product)
    res.render('details', { product: product, cart })
})
app.get('/products/city/:city', async (req, res)=>{
    const selectedCity = req.params.city
    let selectedProducts = await productModel.find({"city": selectedCity}).exec();
    console.log(selectedProducts)
    res.render('products', { products: selectedProducts, cart });
});
app.get('/products/category/:category', async (req, res)=>{
    const selectedCategory = req.params.category
    let selectedProducts = await productModel.find({"category": selectedCategory})
    console.log(selectedProducts)
    res.render('products', { products: selectedProducts, cart });
});
app.post('/sell', urlencodedParser, async (req, res) => {
    const newItem = req.body
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
app.get('/cart/:id', async (req, res) => {
    const selectedId = req.params.id
    const item = await productModel.findOne({"_id": selectedId }).exec();
    cart.push(item); 
    console.log(cart)
    res.redirect('/products');
})
app.get('/cart/delete/:id', (req, res)=>{
    const itemIndex = cart.findIndex(p => p.id == req.params.id)
    cart.splice(itemIndex, 1);
    res.redirect('/cart/');
})
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})