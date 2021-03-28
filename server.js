const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = 3000

app.set('view engine', 'pug')
app.use(express.static('public'))

const products = [
    {id: 1, city: "Vancouver", category: "Cheese", name: "Asiago", description: "Asiago cheese is an Italian cow's milk cheese that has a flavor reminiscent to Parmesan but is a bit nuttier and creamier.", price: "45cad", image: "cheese.webp"},
    {id: 2, city: "Richmond", category: "Bakery", name: "Cheese Croissant", description: "Buttery, flaky and cheesy delicate viennoiseries", price: "7cad", image: "croissant.webp"},
    {id: 3, city: "Vancouver", category: "Bakery", name: "Macaron Cake", description: "Layers of dacquoise buttercream cake topped with macarons", price: "70cad", image: "cake.webp"},
    {id: 4, city: "Vancouver", category: "Cheese", name: "Asiago", description: "Asiago cheese is an Italian cow's milk cheese that has a flavor reminiscent to Parmesan but is a bit nuttier and creamier.", price: "45cad", image: "cheese.webp"},
    {id: 5, city: "Vancouver", category: "Cheese", name: "Asiago", description: "Asiago cheese is an Italian cow's milk cheese that has a flavor reminiscent to Parmesan but is a bit nuttier and creamier.", price: "45cad", image: "cheese.webp"},
    {id: 6, city: "Vancouver", category: "Cheese", name: "Asiago", description: "Asiago cheese is an Italian cow's milk cheese that has a flavor reminiscent to Parmesan but is a bit nuttier and creamier.", price: "45cad", image: "cheese.webp"},
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


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})