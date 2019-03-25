module.exports = (app) => {

  const hasher = require("pbkdf2-password")();//pbkdf2암호화
  const passport = require('passport');//passport
  const LocalStrategy = require('passport-local').Strategy;//로컬에서 지정한 인증방식
  const FacebookStrategy = require('passport-facebook').Strategy;//facebook에서 지정한 인증방식
  const db = require('../../config/orientDB/db')();//외부 db접속모듈
  const bodyparser = require('body-parser');//body form 태그 정보 파싱
  const userDB=[
              {//admin
              salt : 'zgllAK6yiR4DrV3QzUTajWTmq8Uvt1dDrC7AljsRB3NNHx4fwStJIyWhM3r2lHo0IYUJbthzyK7Oznu43ORhwA==',
              username:'admin',
              password:'5HFao6An1wFKmucWIRhxcWndCf0BXEiy9oiuTAY6OIO4uGItKmvZvi38QpsulDkC9WskwAc2P+qAiKg1LLQrPlKXutskWPBCoyiLJ/SgGmbgZuOvcFh2QpoLNHx8V1+hQsx5pZI/RTLu9A7EcBaRZHmmiHL309h7OExaJzfM4iw=',
              displayName:'adminname'
              }
            ];

  app.use(passport.initialize());
  app.use(passport.session());

passport.use(new LocalStrategy(
  (username, password, done) => {
    const sql = 'SELECT * FROM UserDB WHERE username = :username';

    db.query(sql, {params : {username:username}}).then((results)=>{
          console.log(sql);
      console.log(results);
      if(results.length === 0){
        console.log('length0');
        return done(null, false);
      }
      let user = results[0];
      return hasher({password:password, salt:user.salt}, (err, pass, salt, hash) => {
        if(hash === user.password){
          console.log('password');
          done(null, user);
        } else {
          console.log('passwordfail');
          done(null, false);
        }
      });
    })
  }
));

  passport.use(new FacebookStrategy({
      clientID: '439858690100776',
      clientSecret: '111db73bfcd6e660c00c4331064792b1',
      callbackURL: "/auth/facebook/callback",
      profileFields:['id','email','gender','link','locale','name','timezone','updated_time','verified','displayName']
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      let authId = profile.id;
      const sql = 'SELECT * FROM UserDB WHERE username = :username'
      db.query(sql,{params:{username:authId}}).then((results)=>{
        if(results.length == 0){
          let newUser = {
            'username': profile.id,
            'displayName': profile.displayName,
            'email' : profile.emails[0].value
          };
          const sql = 'INSERT INTO UserDB (username, displayName) VALUES (:username, :displayName)';
          db.query(sql, {params:newUser}).then(()=>{
            done(null, newUser);
          }, (err)=>{
            done('error');
          })
        } else {
          done(null, results[0]);
        }
      });

    }
  ));

   passport.serializeUser(function(user, done) {
      console.log('serializeUser', user);
      done(null, user);
    });

  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    const sql = 'SELECT displayName FROM UserDB WHERE username = :username';
    db.query(sql, {params:{username:id.username}}).then(function(results){
      if(results.length === 0){
        done('There is no user.');
      } else {
        done(null, results[0]);
      }
    });
  });
  return passport;
};
