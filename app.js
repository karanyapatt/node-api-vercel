require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
});
const Product = mongoose.model('Product', productSchema);
// create a new product POST /products  
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// get all products GET /products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get a single product GET /products/:id
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// update a product PUT /products/:id
app.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// partially update a product PATCH /products/:id
app.patch('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete a product DELETE /products/:id
app.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const startApp = async () => {
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
        try {
            const uriHost = new URL(process.env.MONGODB_URI).hostname;
            await dns.promises.resolveSrv(`_mongodb._tcp.${uriHost}`);
        } catch (e) {
            console.log('SRV resolve failed, switching to public DNS servers');
            dns.setServers(['8.8.8.8', '1.1.1.1']);
        }
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected gooo');

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startApp().catch((err) => {
    console.error('Failed to start app', err);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
}); 
app.get('/about', (req, res) => {
    res.send('About page');
});
module.exports = app;