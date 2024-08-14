const express = require('express');
const passport = require("passport");
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const LocalStrategy = require("passport-local").Strategy;
const conn = require('./db');
const sha = require('sha256');

const app = express();

app.use(session({
    secret : 'mh',
    resave : false,
    saveUninitialized : true,
}));

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
    console.log(user.userid);
    done(null, user.userid);
});

passport.deserializeUser(function(userid, done) {
    console.log("deserializeUser");
    console.log(userid);

    let sql = "select * from account where userid=?";
    conn.query(sql, [userid], function(err, result) {
        if (err) return done(err);
        if (result.length > 0) {
            done(null, result[0]);
        } else {
            done(new Error("사용자 없음"));
        }
    });
});

passport.use(new LocalStrategy({
    usernameField: 'userid', 
    passwordField: 'userpw', 
}, function (userid, userpw, done) {
    let sql = "select * from account where userid=?";
    conn.query(sql, [userid], function (err, result) {
        if (err) return done(err);
        if (result.length === 0) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        const user = result[0];
        if (user.userpw !== sha(userpw)) { 
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user); 
    });
}));


app.get('/', function(req, res){
    console.log(req.user);
    res.render('index.ejs', {user: req.user});
});

app.get('/enter', function(req, res){
    res.render('enter.ejs');
});

app.post('/save', function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.email);
    let sql = "insert into post (title, content, created, email) value(?, ?, NOW(), ?)";
    let params = [req.body.title, req.body.content, req.body.email];
    conn.query(sql, params, function(err, result) {
        if (err) throw err;
        console.log('데이터 추가 성공');
    });
    res.redirect('/list');
});

app.get('/list', function(req, res){
    conn.query("select * from post", function(err, rows, fields){
        if (err) throw err;
        console.log(rows);
    res.render('list.ejs', {data : rows});
    });
});

app.post('/delete', function(req, res){
    console.log(req.body); 
    let sql = "delete from post where id = ?";
    conn.query(sql, [req.body.id], function(err, result) {
        if (err) throw err;
        console.log('삭제 완료');
    });
    res.send('삭제 완료');
});

app.get('/content/:id', function(req, res){
    console.log(req.params.id);
    let sql = "select * from post where id = ?";
    conn.query(sql, [req.params.id], function(err, result){
        if (err) throw err;
        console.log(result);
    res.render('content.ejs', {data : result[0]});
    });
});

app.get("/edit/:id", function(req, res){
    console.log(req.params.id);
    let sql = "select * from post where id = ?";
    conn.query(sql, [req.params.id], function(err, result){
        if (err) throw err;
        console.log(result);
    res.render('edit.ejs', {data : result[0]});
    });
});

app.post('/edit', function(req, res){
    console.log(req.body); 
    let sql = "UPDATE post SET title = ?, content = ?, email = ?, created = NOW() WHERE id = ?";
    let params = [req.body.title, req.body.content, req.body.email, req.body.id];
    conn.query(sql, params, function(err, result) {
        if (err) throw err;
        console.log('수정 완료');
        res.redirect('/list');
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
    console.log(req.body.userid);
    console.log(sha(req.body.userpw)); 
    console.log(req.body.usergroup);
    console.log(req.body.useremail); 

    let sql = "insert into account (userid, userpw, usergroup, useremail) value(?, ?, ?, ?)";
    let params = [req.body.userid, sha(req.body.userpw), req.body.usergroup, req.body.useremail];
    conn.query(sql, params, function(err, result) {
        if (err) throw err;
        console.log('회원가입 성공');

        let user = {
            userid: req.body.userid,
            usergroup: req.body.usergroup,
            useremail: req.body.useremail
        };
        
        req.login({ userid: req.body.userid }, function(err) {
            if (err) return next(err);
            return res.render('index.ejs', { user: req.user });
        });
    });
});

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

app.listen(8080, function(){
    console.log("포트 8080으로 서버 대기중...");
});
