const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index', {});
});
app.get('/sell', (req, res)=>{
    res.render('sell', {});
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})