const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use('/', express.static('public'));
app.use(cors());
const budget = require('./budget_data');

app.get('/hello',(req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, ()=> {
    console.log(`Example app listening at http://localhost:${port}`);
});