const express = require("express");
const app = express();
const { Op } = require("sequelize");
const { sequelize } = require("./models");
const {
  Bank,
  CountryName,
  Phone,
  Time,
  Language,
  TrafficLaw,
  Target,
  Join,
} = require("./models");
const fs = require("fs");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/bank.html");
});

app.get("/filtering/sub2/country", async (req, res) => {
  var { targetName, countryName1, countryName2, countryName3, countryName4 } =
    req.body;
  if (!countryName2) {
    countryName2 = "a";
  }
  if (!countryName3) {
    countryName3 = "b";
  }
  if (!countryName4) {
    countryName4 = "c";
  }
  const countryList = await Join.findAll({
    attributes: ["countryName", "targetName"],
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ countryName: countryName1 }, { targetName: targetName }],
        },
        {
          [Op.and]: [{ countryName: countryName2 }, { targetName: targetName }],
        },
        {
          [Op.and]: [{ countryName: countryName3 }, { targetName: targetName }],
        },
        {
          [Op.and]: [{ countryName: countryName4 }, { targetName: targetName }],
        },
      ],
    },
    include: [
      {
        attributes: ["countryId"],
        model: CountryName,
        include: [
          {
            model: Bank,
          },
        ],
      },
    ],
  });
  return res.status(200).json({
    countryList,
  });
});

// app.post("/addCountry", async (req, res) => {
//   const { countryName } = req.body;
//   console.log(countryName);
//   await CountryName.create({
//     countryName,
//   });

//   return res.status(200).json({
//     success: "등록 완료",
//   });
// });

app.get("/target", async (req, res) => {
  const { targetName, targetName1, countryName } = req.body;
  const board = await Target.findAll({
    // attributes: ["targetName"],
    where: {
      targetName,
    },
    include: [
      {
        model: CountryName,
        include: [
          {
            model: Bank,
          },
        ],
      },
    ],
  });
  return res.status(200).json({
    board,
  });
});

app.get("/country", async (req, res) => {
  const { countryName } = req.query;
  const board = await CountryName.findAll({
    // attributes: ["countryName"],
    where: {
      countryName,
      // [Op.or]: [{ countryName: countryName }, { countryName: countryName1 }],
    },
    include: [
      {
        model: Join,
      },
    ],
  });
  return res.status(200).json({
    board,
  });
});

app.get("/bank", async (req, res) => {
  const board = await Bank.findAll({
    // include: [
    //   {
    //     model: countryName,
    //   },
    // ],
  });
  return res.status(200).json({
    board,
  });
});

app.get("/phone", async (req, res) => {
  const board = await Phone.findAll({
    // include: [
    //   {
    //     model: countryName,
    //   },
    // ],
  });
  return res.status(200).json({
    board,
  });
});

app.get("/time", async (req, res) => {
  const board = await Time.findAll({
    // include: [
    //   {
    //     model: countryName,
    //   },
    // ],
  });
  return res.status(200).json({
    board,
  });
});

app.get("/language", async (req, res) => {
  const board = await Language.findAll({
    // include: [
    //   {
    //     model: countryName,
    //   },
    // ],
  });
  return res.status(200).json({
    board,
  });
});

app.get("/traffic", async (req, res) => {
  const board = await TrafficLaw.findAll({
    // include: [
    //   {
    //     model: countryName,
    //   },
    // ],
  });
  return res.status(200).json({
    board,
  });
});

app.post("/dataInput", async (req, res) => {
  // 1번 은행, 2번 휴대전화, 3번 표준시, 4번 통용어, 5번 교통법
  const caseNumber = 1;
  const bank = ["은행"];
  const phone = ["휴대전화"];
  const time = ["표준시"];
  const language = ["통용어"];
  const traffic = ["교통법"];
  const country = [
    "뉴질랜드",
    "독일",
    "미국",
    "베트남",
    "싱가포르",
    "영국",
    "일본",
    "중국",
    "캐나다",
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
          } = jsonFile;

          await Bank.create({
            bankRequirePaper,
            mainBank,
            bankStep,
            bankCaution,
            accountType,
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
          const { phoneOpeningMethod, mainTelecom, recommendPlan } = jsonFile;

          await Phone.create({
            phoneOpeningMethod,
            mainTelecom,
            recommendPlan,
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
          const { standardTime } = jsonFile;

          await Time.create({
            standardTime,
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
          const { standardLanguage } = jsonFile;

          await Language.create({
            standardLanguage,
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
          const { trafficLaw } = jsonFile;

          await TrafficLaw.create({
            trafficLaw,
          });
        }
      }
      break;
  }

  return res.status(200).json({
    success: "등록 완료",
  });
});

app.listen(3000, () => console.log("start.."));
