// const 코드 ---------------------------------------------------------------------------------------------------------
const express = require('express');
const passport = require("passport");
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const LocalStrategy = require("passport-local").Strategy;
const conn = require('./db');
// const sha = require('sha256');

let multer = require('multer');
let storage = multer.diskStorage({
    destination : function(req, file, done){
        done(null, './public/images/')
    },
    filename : function(req, file, done){
        done(null, Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({storage : storage});
let image_path = '';
const path = require('path');

const app = express();
const PORT = 8888;

// app.use 코드 ---------------------------------------------------------------------------------------------------------
app.use(express.static("public"));
app.use("/public/images", express.static(path.join(__dirname, 'public', 'images')));

app.use(session({
    secret : 'mh',
    resave : false,
    saveUninitialized : true,
}));
// 세션 코드는 인증 코드보다 앞에 위치해야 함

// passport 관련 코드 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser('mh'));

require('./strategies/facebook')(passport);
require('./strategies/google')(passport);
require('./strategies/naver')(passport);
require('./strategies/kakao')(passport);

passport.serializeUser(function(user, done) {
    console.log("serializeUser");
    console.log(user.user_id);
    done(null, user.user_id);
});

passport.deserializeUser(function(user_id, done) {
    console.log("deserializeUser");
    console.log(user_id);

    let sql = "select * from member where user_id=?";
    conn.query(sql, [user_id], function(err, result) {
        if (err) return done(err);
        if (result.length > 0) {
            done(null, result[0]);
        } else {
            done(new Error("사용자 없음"));
        }
    });
});

passport.use(new LocalStrategy({
    usernameField: 'user_id', 
    passwordField: 'password', 
}, function (user_id, password, done) {
    let sql = "select * from member where user_id=?";
    conn.query(sql, [user_id], function (err, result) {
        if (err) return done(err);
        if (result.length === 0) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        const user = result[0];
        // if (user.password !== sha(password)) {
        if (user.password !== password) { 
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user); 
    });
}));

// app 관련 코드 ---------------------------------------------------------------------------------------------------------
app.get('/', function(req, res){
    console.log(req.user);
    res.render('index.ejs', {user: req.user});
});

app.get('/main', function(req, res){
    console.log("Main Page");
    res.render('main.ejs');
});

app.get('/order', function(req, res){
    conn.query("select * from `order`", function(err, rows, fields){
        if (err) throw err;
        console.log(rows);
        res.render('order.ejs', {data : rows});
    });
});

app.get('/member', function(req, res){
    conn.query("select * from member", function(err, rows, fields){
        if (err) throw err;
        console.log(rows);
        res.render('member.ejs', {data : rows});
    });
});

app.get('/product', function(req, res){
    conn.query("select * from product", function(err, rows, fields){
        if (err) throw err;
        console.log(rows);
        res.render('product.ejs', {data : rows});
    });
});

app.get('/store', function(req, res){
    conn.query("select * from store", function(err, rows, fields){
        if (err) throw err;
        console.log(rows);
        res.render('store.ejs', {data : rows});
    });
});

app.get('/market', function(req, res){
    conn.query("select * from product", function(err, rows){
        if (err) throw err;
        console.log("Loaded market successfully.");
        console.log({data : rows});
        res.render('market.ejs', {data : rows});
    });
});

app.get('/input', function(req, res){
    res.render('input.ejs');
});

app.post('/photo', upload.single('picture'), function(req, res){
    image_path = '\\' + req.file.path;
    console.log("app.post: " + image_path);
    console.log(req.file.path);
})

app.post('/save', function(req, res){
    console.log(req.body.product_id);
    console.log(req.body.product_name);
    console.log(req.body.stock);
    console.log(req.body.price);
    console.log(req.body.category);
    console.log(req.body.product_type);
    console.log(image_path);

    let sql = "insert into product (product_id, product_name, stock, price, category, product_type, image_path) value(?, ?, ?, ?, ?, ?, ?)";
    let params = [req.body.product_id, req.body.product_name, req.body.stock, req.body.price, req.body.category, req.body.product_type, image_path];
    conn.query(sql, params, function(err, result) {
        if (err) throw err;
        console.log('Product added successfully');
        res.redirect('/market');
    });
});

app.get("/login", function(req,res){
    console.log(req.session);
    if(req.session.user){
        console.log('Session maintained');
        res.render('index.ejs', {user : req.session.user});
    }else{
        res.render("login.ejs");
    }
});

app.post(
    '/login', 
    passport.authenticate("local", {
        failureRedirect: "/fail",
    }),
    function(req, res){
        console.log(req.session);
        console.log(req.user);
        res.render("index.ejs", {user : req.user});
    },
);

app.get("/logout", function(req,res){
    console.log("Logout");
    req.session.destroy();
    res.render('index.ejs' , {user : null});
});

app.get("/signup", function(req,res){
    res.render("signup.ejs");
});

app.post('/signup', function(req, res){
    console.log(req.body.user_id);
    console.log(req.body.password); 
    console.log(req.body.name);
    console.log(req.body.nickname); 
    console.log(req.body.birthdate); 
    console.log(req.body.phone);
    console.log(req.body.email); 
    console.log(req.body.address);

    let sql = "insert into member (user_id, password, name, nickname, birthdate, phone, email, address) value(?, ?, ?, ?, ?, ?, ?, ?)";
    let params = [req.body.user_id, req.body.password, req.body.name, req.body.nickname, req.body.birthdate, req.body.phone, req.body.email, req.body.address];

    conn.query(sql, params, function(err, result) {
        if (err) throw err;
        console.log('Signup successful');

        let user = {
            user_id: req.body.user_id,
            name: req.body.name,
            nickname: req.body.nickname
        };
        
        req.login({ user_id: req.body.user_id }, function(err) {
            if (err) return next(err);
            return res.render('index.ejs', { user: req.user });
        });
    });
});

app.get("/aboutUs", function(req,res){
    res.render("aboutUs.ejs");
});

/*
app.get("/cart", function(req,res){
    res.render("cart.ejs");
});
*/

// 장바구니 보기
app.get('/cart', function(req, res) {
    // 세션에서 로그인한 사용자의 ID를 가져옴
    const user_id = req.session.user_id; // 세션에 저장된 user_id 사용

    // 로그인 여부에 따라 다르게 처리
    if (!user_id) {
        // 로그인하지 않은 경우
        res.render('cart.ejs', { cartData: null, totalPrice: 0, loggedIn: false });
    } else {
        // 로그인한 경우 장바구니와 상품 정보를 조회
        const query = `
            SELECT Product.product_name, Product.price, Cart.quantity, Cart.product_id 
            FROM cart AS Cart
            JOIN product AS Product ON Cart.product_id = Product.product_id 
            WHERE Cart.user_id = ?;
        `;

        conn.query(query, [user_id], function(err, rows) {
            if (err) throw err;

            // 총 가격 계산
            const totalPrice = rows.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // 장바구니 페이지로 데이터 전달
            res.render('cart.ejs', { cartData: rows, totalPrice: totalPrice, loggedIn: true });
        });
    }
});

// 장바구니 상품 수량 수정
app.post('/cart/update/:product_id', function(req, res) {
    const user_id = req.session.user_id; // 세션에서 user_id 가져옴
    const { product_id } = req.params;
    const { quantity } = req.body;

    if (!user_id) {
        return res.redirect('/login'); // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    }

    const query = `
        UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?;
    `;

    conn.query(query, [quantity, user_id, product_id], function(err, result) {
        if (err) throw err;

        // 수량 수정 후 다시 장바구니 페이지로 리다이렉트
        res.redirect('/cart');
    });
});

// 장바구니에서 상품 삭제
app.post('/cart/delete/:product_id', function(req, res) {
    const user_id = req.session.user_id; // 세션에서 user_id 가져옴
    const { product_id } = req.params;

    if (!user_id) {
        return res.redirect('/login'); // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    }

    const query = `
        DELETE FROM cart WHERE user_id = ? AND product_id = ?;
    `;

    conn.query(query, [user_id, product_id], function(err, result) {
        if (err) throw err;

        // 삭제 후 다시 장바구니 페이지로 리다이렉트
        res.redirect('/cart');
    });
});


// 장바구니에서 상품 삭제
app.post('/cart/delete/:product_id', function(req, res) {
    const user_id = req.session.user_id; // 세션에서 user_id 가져옴
    const { product_id } = req.params;

    if (!user_id) {
        return res.redirect('/login'); // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    }

    const query = `
        DELETE FROM cart WHERE user_id = ? AND product_id = ?;
    `;

    conn.query(query, [user_id, product_id], function(err, result) {
        if (err) throw err;

        // 삭제 후 다시 장바구니 페이지로 리다이렉트
        res.redirect('/cart');
    });
});


// 플랫폼 인증 ---------------------------------------------------------------------------------------------------------
app.get('/facebook', passport.authenticate('facebook'));
app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect : '/',
    failureRedirect : "/fail",
}));

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/fail' }), function(req, res) {
    res.redirect('/');
});

app.get('/naver', passport.authenticate('naver'));
app.get('/naver/callback', passport.authenticate('naver', {
    successRedirect : '/',
    failureRedirect : "/fail",
}));

app.get('/kakao', passport.authenticate('kakao'));
app.get('/kakao/callback', passport.authenticate('kakao', {
    successRedirect : '/',
    failureRedirect : "/fail",
}));

// 서버 작동 콘솔 -------------------------------------------------------------------------------------------------------
app.listen(8888, '0.0.0.0', function(){
    console.log("Server listening on port 8888...");
    console.log("http://localhost:8888/");
    console.log("http://localhost:8888/main")
    console.log("http://192.168.0.71:8888/main")
});
