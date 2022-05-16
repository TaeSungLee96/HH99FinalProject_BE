const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models");

module.exports = (req, res, next) => {
  const Token = req.headers.authorization;
  const logInToken = Token.replace(" ", "");

  try {
    const token = jwt.verify(logInToken, process.env.key);
    console.log("#토큰값이다:", token);
    const { userId } = token;
    console.log("##유저ID값이다", userId);

    User.findOne({
      logging: false,
      where: { userId },
    })
      // .exec()
      .then((userInfo) => {
        // DB에 있는 유저 정보
        res.locals.userInfo = userInfo;

        // 로그인 토큰 값
        res.locals.token = logInToken;
        next();
      });
  } catch (error) {
    console.log("authMiddleWare.js에서 에러남");
    res.status(401).json({ msg: "토큰이 유효하지 않습니다." });
    return;
  }
};
//미들웨어를 거치면 인증이 끝남.
