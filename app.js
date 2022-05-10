const express = require("express");
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/seoul");
const cors = require("cors");
const { sequelize } = require("./models");

// https 기본 모듈들 불러오기
const fs = require("fs");
const http = require("http");
const https = require("https");
const app = express();
const app_low = express();

// 인증서 불러오기
const privateKey = fs.readFileSync(__dirname + "/private.key", "uft-8");
const certificate = fs.readFileSync(__dirname + "/certificate.crt", "uft-8");
const ca = fs.readFileSync(__dirname + "/ca_bundle.crt", "utf-8");
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

// 포트설정
const httpPort = 3000;
const httpsPort = 5010;

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

// 각종 미들웨어 추가
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestMiddleware);
app.use(express.static("uploads"));

// https 인증용 라우터
app.get(
  "/.well-known/pki-validation/B84B2EC027FBF414853F6A60FAD6D0E2.txt",
  (req, res) => {
    res.sendFile(
      __dirname +
        "/well-known/pki-validation/B84B2EC027FBF414853F6A60FAD6D0E2.txt"
    );
  }
);

// 라우터 연결하기
app.use("/main", [mainPage]);
app.use("/sub1", [subMainPage1]);
app.use("/sub2", [subMainPage2]);
app.use("/post", [postPage]);
app.use("/comment", [commentPage]);
app.use("/oauth", [auth]);

// DB에 데이터를 넣기위한 API
app.post("/dataInput", async (req, res) => {
  // 1번 은행, 2번 휴대전화, 3번 표준시, 4번 통용어, 5번 교통법, 6번 비자
  const caseNumber = 5;
  const bank = ["은행"];
  const phone = ["휴대전화"];
  const time = ["표준시"];
  const language = ["통용어"];
  const traffic = ["교통법"];
  const visa = ["비자"];
  const country = [
    "뉴질랜드",
    "독일",
    "미국북동부",
    "미국서부",
    "베트남",
    "싱가포르",
    "영국",
    "일본",
    "중국",
    "캐나다동부",
    "캐나다북부",
    "캐나다서부",
    "호주",
  ];
  switch (caseNumber) {
    case 1:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < bank.length; j++) {
          const countryName = country[i] + "_" + bank[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/project/은행/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const {
            bankRequirePaper,
            mainBank,
            bankStep,
            bankCaution,
            accountType,
            name,
          } = jsonFile;

          await Bank.create({
            bankRequirePaper,
            mainBank,
            bankStep,
            bankCaution,
            accountType,
            name,
          });
        }
      }
      break;
    case 2:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < phone.length; j++) {
          const countryName = country[i] + "_" + phone[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/project/휴대전화/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { phoneOpeningMethod, mainTelecom, recommendPlan, name } =
            jsonFile;

          await Phone.create({
            phoneOpeningMethod,
            mainTelecom,
            recommendPlan,
            name,
          });
        }
      }
      break;
    case 3:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < time.length; j++) {
          const countryName = country[i] + "_" + time[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/project/표준시/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { standardTime, name } = jsonFile;

          await Time.create({
            standardTime,
            name,
          });
        }
      }
      break;
    case 4:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < language.length; j++) {
          const countryName = country[i] + "_" + language[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/project/통용어/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { standardLanguage, name } = jsonFile;

          await Language.create({
            standardLanguage,
            name,
          });
        }
      }
      break;
    case 5:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < traffic.length; j++) {
          const countryName = country[i] + "_" + traffic[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/project/교통법/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { trafficLaw, name } = jsonFile;

          await TrafficLaw.create({
            trafficLaw,
            name,
          });
        }
      }
      break;
    case 6:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < visa.length; j++) {
          const countryName = country[i] + "_" + visa[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/project/비자/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const {
            workVisa,
            immigrationVisa,
            workingHolidayVisa,
            studyVisa,
            name,
          } = jsonFile;
          // console.log(workVisa);

          // await Visa.create({
          //   workVisa,
          //   immigrationVisa,
          //   workingHolidayVisa,
          //   studyVisa,
          //   name,
          // });
        }
      }
      break;
  }

  return res.status(200).json({
    success: "등록 완료",
  });
});

http.createServer(app_low).listen(httpPort, () => {
  console.log("http서버가 켜졌습니다.");
});

https.createServer(credentials, app).listen(httpsPort, () => {
  console.log("https서버가 켜졌습니다.");
});
