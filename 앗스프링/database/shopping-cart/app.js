const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;  // 포트 번호를 4000으로 변경

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'product.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

app.get('/images', (req, res) => {
    const imagesDir = path.join(__dirname, 'public', 'images');
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load images' });
        }
        const images = files.map(file => ({
            name: path.parse(file).name,
            url: `/images/${file}`
        }));
        res.json(images);
    });
});

app.listen(PORT, '192.168.0.71', () => {
    console.log(`Server is running on http://192.168.0.71:4000`);
});

// http://192.168.0.71:4000