const NaverStrategy = require("passport-naver").Strategy;
const conn = require('../db');
//const sha = require('sha256');

module.exports = function(passport) {
    passport.use(new NaverStrategy(
        {
            clientID: "XZk76P4haemDIfPzzUWh",
            clientSecret: "AhoaGMiEoN",
            callbackURL: "/naver/callback",
            profileFields: ['id', 'displayName', 'emails']
        },
        function (accessToken, refreshToken, profile, done){
            console.log(profile);

            var authkey = "naver" + profile.id;
            var authName = profile.displayName;
            var authEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    
            let sql = "select * from 회원 where 아이디=?";
            let params = [authkey];
            conn.query(sql, params, function(err, result) {
                if (err) return done(err);
        
                if(result.length > 0) {
                    return done(null, result[0]);
                    } else {
                        let insertSql = "insert into 회원 (아이디, 비밀번호, 메일, 닉네임, displayName) values (?, ?, ?, ?, ?)";
                        let insertParams = [authkey, authkey, authEmail, displayName];
                        conn.query(insertSql, insertParams, function(err,insertResult){
                            if (err) return done(err);
    
                            return done(null, {
                                아이디: authkey,
                                비밀번호: authkey,
                                메일: authEmail,
                                displayName: displayName
                            });
                        });
                }
            });
        }
        
    )
    );
    
}