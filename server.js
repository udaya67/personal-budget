const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose'); // Add Mongoose
const bodyParser = require('body-parser');
const port = 3000;

mongoose.connect('mongodb+srv://udaya:mongodbudaya@cluster0.k0bk5.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
const budgetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    value: { type: Number, required: true },
    color: { type: String, required: true, validate: /^#[0-9A-F]{6}$/i } // Validate hex color
});

const Budget = mongoose.model('Budget', budgetSchema);
app.use(bodyParser.json());
app.use('/', express.static('public'));
app.use(cors());
const budget = require('./budget_data');

app.get('/hello',(req, res) => {
    res.send('Hello World!');
});

// app.get('/budget', (req, res) => {
//     res.json(budget);
// });

// Endpoint to fetch budget data
app.get('/budget', async (req, res) => {
    const budgets = await Budget.find(); 
    res.json(budgets);
});
app.post('/budget', async (req, res) => {
    try {
        const entries = req.body; // Expecting an array of budget entries

        // Validate  data
        if (!Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({ message: "An array of budget entries is required" });
        }

        for (const entry of entries) {
            const { title, value, color } = entry;
            if (!title || !value || !color) {
                return res.status(400).json({ message: "All fields are required for each entry" });
            }
        }

        const newBudgets = await Budget.insertMany(entries);
        
        res.status(201).json(newBudgets);
    } catch (error) {
        res.status(500).json({ message: "Error adding budget entries", error: error.message });
    }
});


app.listen(port, ()=> {
    console.log(`Example app listening at http://localhost:${port}`);
});