var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mhnawara",
  database: "webpages",
});

conn.connect();

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8090;

app.get('/', function(req, res){
    res.render('index.ejs');
});

app.get('/order', function(req, res){
    conn.query("select * from 주문", function(err, rows, fields){
        if (err) throw err;
        console.log(rows);
    res.render('order.ejs', {data : rows});
    });
});

app.get('/member', function(req, res){
    conn.query("select * from 회원", function(err, rows, fields){
        if (err) throw err;
        console.log(rows);
    res.render('member.ejs', {data : rows});
    });
});

app.get('/product', function(req, res){
    conn.query("select * from 상품", function(err, rows, fields){
        if (err) throw err;
        console.log(rows);
    res.render('product.ejs', {data : rows});
    });
});

app.get('/store', function(req, res){
    conn.query("select * from 스토어", function(err, rows, fields){
        if (err) throw err;
        console.log(rows);
    res.render('store.ejs', {data : rows});
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
