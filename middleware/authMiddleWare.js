const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models");

module.exports = (req, res, next) => {
  const Token = req.headers.authorization;
  console.log("헤더에 담긴 토큰 값 :", Token);
  const logInToken = Token.replace("Bearer", "");

  try {
    const token = jwt.verify(logInToken, process.env.key);
    const { userId } = token;
    console.log("여기 온다");
    User.findOne({
      logging: false,
      where: { userId },
    }).then((userInfo) => {
      // DB에 있는 유저 정보
      res.locals.userInfo = userInfo;

      // 로그인 토큰 값
      res.locals.token = logInToken;
      next();
    });
  } catch (error) {
    console.log("authMiddleWare.js에서 에러남");
    console.log(error);
    return res.status(401).json({ msg: "토큰이 유효하지 않습니다." });
  }
};
