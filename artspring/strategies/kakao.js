const KakaoStrategy = require("passport-kakao").Strategy;
const conn = require('../db');
const sha = require('sha256');

module.exports = function(passport) {
    passport.use(new KakaoStrategy(
        {
            clientID: "651187c4aaafd9ae674f65b82df4ccd8",
            callbackURL: "/kakao/callback",
            profileFields: ['id', 'displayName', 'emails']
        },
        function (accessToken, refreshToken, profile, done){
            console.log(profile);

            var authkey = "kakao" + profile.id;
            var authName = profile.displayName;
            var authEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    
            let sql = "select * from account where userid=?";
            let params = [authkey];
            conn.query(sql, params, function(err, result) {
                if (err) return done(err);
        
                if(result.length > 0) {
                    return done(null, result[0]);
                    } else {
                        let insertSql = "insert into account (userid, userpw, usergroup, useremail) values (?, ?, ?, ?)";
                        let insertParams = [authkey, sha(authkey), 'kakao', authEmail];
                        conn.query(insertSql, insertParams, function(err,insertResult){
                            if (err) return done(err);
    
                            return done(null, {
                                userid: authkey,
                                userpw: sha(authkey),
                                usergroup: 'kakao',
                                useremail: authEmail,
                                displayName: displayName
                            });
                        });
                }
            });
        }
        
    )
    );
    
}