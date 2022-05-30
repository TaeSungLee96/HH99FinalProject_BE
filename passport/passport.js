var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
require("dotenv").config();
const { User } = require("../models");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      // 여기는 프론트 주소 넣는곳임 맨뒤에 / 붙이는걸 추천함
      callbackURL: "https://a-fo.kr/oauth/google/callback/",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log("profile: ", profile.id);
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
          const newUser = await User.create({
            userName: profile.displayName,
            userId: profile.id,
            penalty: 0,
            penaltedAt: new Date() - 259205000,
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

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.clientID, // 카카오 로그인에서 발급받은 REST API 키
      callbackURL: "http://localhost:3000/oauth/kakao/callback", // 카카오 로그인 Redirect URI 경로
    },

    // clientID에 카카오 앱 아이디 추가
    // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
    // accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰
    // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
    async (accessToken, refreshToken, profile, done) => {
      try {
        const exUser = await User.findOne({
          // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
          where: { userId: profile.id },
        });
        // 이미 가입된 카카오 프로필이면 성공
        if (exUser) {
          done(null, exUser); // 로그인 인증 완료
        } else {
          // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
          const newUser = await User.create({
            userName: profile.username,
            userId: profile.id,
            penalty: 0,
            penaltedAt: new Date() - 259205000,
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
