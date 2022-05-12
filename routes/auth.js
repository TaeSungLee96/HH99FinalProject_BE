var express = require("express");
var router = express.Router();
var passport = require("../passport/passport.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Google 로그인
/// Google 로그인버튼 클릭시 호출됨 --> GoogleStrategy설정에 따른 로그인 페이지제공
/// 아이디, 비번 입력 후 확인버튼누름
/// --> 성공시 http://localhost:3000/oauth/google/callback에 의해 http://localhost:3000 페이지로 리다이렉트된다.
/// --> 실패시 http://localhost:3000/oauth/google/callback에 의해 http://localhost:3000/login 페이지로 리다이렉트된다.
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

///
const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/" },
    (err, user, info) => {
      if (err) return next(err);
      console.log("콜백~~~");
      const { userId, userName } = user;

      // 토큰 옵션 설정
      const payload = { userId, userName };
      const secret = process.env.key;
      const options = {
        issuer: "백엔드 개발자", // 발행자
        expiresIn: "1d", // 날짜: $$d, 시간: $$h, 분: $$m, 그냥 숫자만 넣으면 ms단위
      };

      const token = jwt.sign(payload, secret, options);
      result = {
        token,
        userId,
        userName,
      };
      console.log(result);
      res.json({ result });
    }
  )(req, res, next);
};
router.get("/google/callback", googleCallback);

//Kakao 로그인
router.get("/kakao", passport.authenticate("kakao"));

const kakaoCallback = (req, res, next) => {
  passport.authenticate(
    "kakao",
    { failureRedirect: "/" },
    (err, user, info) => {
      if (err) return next(err);
      console.log("콜백~~~");
      const { userId, userName } = user;

      // 토큰 옵션 설정
      const payload = { userId };
      const secret = process.env.key;
      const options = {
        issuer: "백엔드 개발자", // 발행자
        expiresIn: "1d", // 날짜: $$d, 시간: $$h, 분: $$m, 그냥 숫자만 넣으면 ms단위
      };

      const token = jwt.sign(payload, secret, options);
      result = {
        token,
        userId,
        userName,
      };
      res.json({ result });
    }
  )(req, res, next);
};
router.get("/kakao/callback", kakaoCallback);

module.exports = router;
