// const 코드 ---------------------------------------------------------------------------------------------------------
const express = require('express');
const passport = require("passport");
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const LocalStrategy = require("passport-local").Strategy;
const conn = require('./db');
//const sha = require('sha256');

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
let imagepath = '';
const path = require('path');

const app = express();

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
    console.log(user.아이디);
    done(null, user.아이디);
});

passport.deserializeUser(function(아이디, done) {
    console.log("deserializeUser");
    console.log(아이디);

    let sql = "select * from 회원 where 아이디=?";
    conn.query(sql, [아이디], function(err, result) {
        if (err) return done(err);
        if (result.length > 0) {
            done(null, result[0]);
        } else {
            done(new Error("사용자 없음"));
        }
    });
});

passport.use(new LocalStrategy({
    usernameField: '아이디', 
    passwordField: '비밀번호', 
}, function (아이디, 비밀번호, done) {
    let sql = "select * from 회원 where 아이디=?";
    conn.query(sql, [아이디], function (err, result) {
        if (err) return done(err);
        if (result.length === 0) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        const user = result[0];
        //if (user.비밀번호 !== sha(비밀번호)) { 
        if (user.비밀번호 !== 비밀번호) { 

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
    console.log("메인 페이지");
    res.render('main.ejs');
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
/*
app.get('/market', function(req, res){
    conn.query("select * from 상품", function(err, result){
        if (err) throw err;
        console.log("상픔 마켓을 잘 가져 옵니까?");
        res.render('market.ejs', {data : result});
    });
});
*/
app.get('/market', function(req, res){
    conn.query("select * from 상품", function(err, rows){
        if (err) throw err;
        console.log("상픔 마켓을 잘 가져 옵니까?");
        console.log({data : rows});
        res.render('market.ejs', {data : rows});
    });
});

app.get('/input', function(req, res){
    res.render('input.ejs');
});


app.post('/photo', upload.single('picture'), function(req, res){
    imagepath = '\\' + req.file.path;
    console.log("app.post: " + imagepath);
    console.log(req.file.path);
})

app.post('/save', function(req, res){
    console.log(req.body.상품번호);
    console.log(req.body.상품명);
    console.log(req.body.재고량);
    console.log(req.body.가격);
    console.log(req.body.카테고리);
    console.log(req.body.상품종류);
    console.log(imagepath);

    let sql = "insert into 상품 (상품번호, 상품명, 재고량, 가격, 카테고리, 상품종류, imagepath) value(?, ?, ?, ?, ?, ?, ?)";
    let params = [req.body.상품번호, req.body.상품명, req.body.재고량, req.body.가격, req.body.카테고리, req.body.상품종류, imagepath];
    conn.query(sql, params, function(err, result) {
        if (err) throw err;
        console.log('데이터 추가 성공');
        res.redirect('/market');
    });
});


app.get("/login", function(req,res){
    console.log(req.session);
    if(req.session.user){
        console.log('세션 유지');
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
    console.log("로그아웃");
    req.session.destroy();
    res.render('index.ejs' , {user : null});
});

app.get("/signup", function(req,res){
    res.render("signup.ejs");
});

app.post('/signup', function(req, res){
    console.log(req.body.아이디);
    //console.log(sha(req.body.비밀번호)); 
    console.log(req.body.비밀번호); 
    console.log(req.body.이름);
    console.log(req.body.닉네임); 
    console.log(req.body.생일); 
    console.log(req.body.전화번호);
    console.log(req.body.메일); 
    console.log(req.body.주소);

    let sql = "insert into 회원 (아이디, 비밀번호, 이름, 닉네임, 생일, 전화번호, 메일, 주소) value(?, ?, ?, ?, ?, ?, ?, ?)";
    //let params = [req.body.아이디, sha(req.body.비밀번호), req.body.이름, req.body.닉네임];
    let params = [req.body.아이디, req.body.비밀번호, req.body.이름, req.body.닉네임, req.body.생일, req.body.전화번호, req.body.메일, req.body.주소];

    conn.query(sql, params, function(err, result) {
        if (err) throw err;
        console.log('회원가입 성공');

        let user = {
            아이디: req.body.아이디,
            이름: req.body.이름,
            닉네임: req.body.닉네임
        };
        
        req.login({ 아이디: req.body.아이디 }, function(err) {
            if (err) return next(err);
            return res.render('index.ejs', { user: req.user });
        });
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
app.listen(8888, function(){
    console.log("포트 8888으로 서버 대기중...");
    console.log("http://localhost:8888/");
    console.log("http://localhost:8888/main")
//    console.log("http://192.168.0.71:8888/")
});
