var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
const { User } = require("../models");
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3000/oauth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      console.log("profile: ", profile);
      try {
        const exUser = await User.findOne({
          // 구글 플랫폼에서 로그인 했고 & snsId필드에 구글 아이디가 일치할경우
          where: { userId: profile.id },
        });
        // 이미 가입된 구글 프로필이면 성공
        if (exUser) {
          done(null, exUser); // 로그인 인증 완료
        } else {
          // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
          const newUser = User.create({
            userName: profile.displayName,
            userId: profile.id,
          });
          done(null, newUser); // 회원가입하고 로그인 인증 완료
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

module.exports = passport;
