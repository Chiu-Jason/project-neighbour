const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = 3000

app.set('view engine', 'pug')
app.use(express.static('public'))

const products = [
    {id: 1, city: "Vancouver", category: "Cheese", name: "Asiago", description: "Asiago cheese is an Italian cow's milk cheese that has a flavor reminiscent to Parmesan but is a bit nuttier and creamier.", price: "45 cad", image: "cheese1.webp"},
    {id: 2, city: "Richmond", category: "Bakery", name: "Cheese Croissant", description: "Buttery, flaky and cheesy delicate viennoiseries", price: "7 cad", image: "croissant.webp"},
    {id: 3, city: "Vancouver", category: "Bakery", name: "Macaron Cake", description: "Layers of dacquoise buttercream cake topped with macarons", price: "70 cad", image: "cake.webp"},
    {id: 4, city: "Vancouver", category: "Cheese", name: "Brie", description: "The flavor of brie is rich, buttery, fruity, and increasingly earthy with age.", price: "15 cad", image: "brie.webp"},
    {id: 5, city: "Richmond", category: "Cheese", name: "Gorgonzola", description: 'It can be buttery or firm, crumbly and quite salty, with a "bite" from its blue veining.', price: "30 cad", image: "gorgonzola.webp"},
    {id: 6, city: "Richmond", category: "Bakery", name: "Apple Pie", description: 'A tender crust and a sweet apple filling combine to form a powerful synergy that is hard to beat.', price: "40 cad", image: "apple-pie.webp"},
    {id: 7, city: "Vancouver", category: "Bakery", name: "Donuts", description: "Light and Airy, Buttery and Flavourful ", price: "45 cad", image: "donuts2.webp"},
    {id: 8, city: "Richmond", category: "Cheese", name: "Parmesan", description: "True Parmesan cheese has a hard, gritty texture and is fruity and nutty in taste.", price: "28 cad", image: "parmesan.webp"},
    {id: 9, city: "Vancouver", category: "Bakery", name: "Lemon tart", description: "It has a pastry shell with a lemon flavored filling.", price: "25 cad", image: "lemon-tart.webp"},
    {id: 10, city: "Vancouver", category: "Cheese", name: "Buffalo Mozarella", description: "Buffalo mozzarella is creamier, softer, and far more flavorful than the cow-milk stuff, with a tanginess and depth of flavor that's all its own.", price: "18 cad", image: "buffalo-moza.webp"},
    {id: 11, city: "Richmond", category: "Bakery", name: "Rainbow Cake", description: "Layers of colourful moist vanilla buttermilk cake and easy buttercream frosting. ", price: "85 cad", image: "rainbow-cake.webp"},
    {id: 12, city: "Richmond", category: "Bakery", name: "Chocolate Cake", description: "Rich and decadent chocolatey goodness", price: "65 cad", image: "choco-cake.webp"},

];

app.get('/', (req, res) => {
    res.render('index', {});
});
app.get('/sell', (req, res)=>{
    res.render('sell', {});
});
app.get('/products/', (req, res)=>{
    res.render('products', { products: products})
});
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id)
    res.render('details', { product: product })
})
app.get('/products/city/:city', (req, res)=>{
    let selectedProducts = products.filter(p => p.city == req.params.city)
    console.log(selectedProducts)
    res.render('products', { products: selectedProducts });
});
app.get('/products/category/:category', (req, res)=>{
    let selectedProducts = products.filter(p => p.category == req.params.category)
    console.log(selectedProducts)
    res.render('products', { products: selectedProducts });
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})