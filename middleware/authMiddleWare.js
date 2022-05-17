const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../models");

module.exports = (req, res, next) => {
  console.log("##", req.headers);
  const Token = req.headers.Authorization;
  console.log(Token);
  const logInToken = Token.replace(" ", "");

  try {
    const token = jwt.verify(logInToken, process.env.key);
    const { userId } = token;

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
    console.log(error);
    res.status(401).json({ msg: "토큰이 유효하지 않습니다." });
    return;
  }
};
//미들웨어를 거치면 인증이 끝남.
