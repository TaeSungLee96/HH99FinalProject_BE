const express = require("express");
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/seoul");
const cors = require("cors");
const { sequelize } = require("./models");
const helmet = require("helmet");

// https 기본 모듈들 불러오기
const fs = require("fs");
const http = require("http");
const https = require("https");
const app = express();
const app_low = express();

// 인증서 불러오기
const privateKey = fs.readFileSync(__dirname + "/a-fo-back_shop.key", "utf-8");
const certificate = fs.readFileSync(
  __dirname + "/a-fo-back_shop__crt.pem",
  "utf-8"
);
const ca = fs.readFileSync(__dirname + "/a-fo-back_shop__ca.pem", "utf-8");
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

// 포트설정
const httpPort = 3000;
const httpsPort = 443;

// https 리다이렉션 하기
// app_low : http전용 미들웨어
app_low.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    const to = `https://${req.hostname}:${httpsPort}${req.url}`;
    console.log(to);
    res.redirect(to);
  }
});

//라우터 불러오기
const mainPage = require("./routes/mainPage");
const subMainPage1 = require("./routes/subMainPage1");
const subMainPage2 = require("./routes/subMainPage2");
const postPage = require("./routes/postPage");
const commentPage = require("./routes/commentPage");
const auth = require("./routes/auth");
const DBdataInput = require("./routes/DBdataInput");
const ipDelete = require("./routes/ip");

// sequelize 연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

// 접속 로그 남기기
const requestMiddleware = (req, res, next) => {
  console.log(
    "[Ip address]:",
    req.ip,
    "[method]:",
    req.method,
    "[Request URL]:",
    req.originalUrl,
    " - ",
    moment().format("YYYY-MM-DD HH:mm")
  );
  next();
};

// let corsOpt = {
//   origin: "https://a-fo.kr",
//   credentials: true,
// };

// 각종 미들웨어 추가
app.use(cors());
// app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestMiddleware);
app.use(express.static("uploads"));

// 라우터 연결하기
app.use("/main", [mainPage]);
app.use("/sub1", [subMainPage1]);
app.use("/sub2", [subMainPage2]);
app.use("/post", [postPage]);
app.use("/comment", [commentPage]);
app.use("/oauth", [auth]);
app.use("/DBdataInput", [DBdataInput]);
app.use("/ip", [ipDelete]);

// app.listen(3000, () => console.log("start.."));
http.createServer(app_low).listen(httpPort, () => {
  console.log("http서버가 켜졌습니다.");
});

https.createServer(credentials, app).listen(httpsPort, () => {
  console.log("https서버가 켜졌습니다.!!");
});
