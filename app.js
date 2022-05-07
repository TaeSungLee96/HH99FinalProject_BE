const express = require("express");
const app = express();
const cors = require("cors");
const { Op } = require("sequelize");
const { sequelize } = require("./models");
const {
  Bank,
  CountryName,
  Phone,
  Time,
  Language,
  TrafficLaw,
  Visa,
  Target,
  Join,
  Continent,
} = require("./models");
const fs = require("fs");
// const { info } = require("console");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/bank.html");
});

app.get("/main/allCountry", async (req, res) => {
  try {
    const land = await Continent.findAll({
      attributes: ["info"],
      where: {
        purpose: "all",
      },
    });
    return res.status(200).json({
      land,
    });
  } catch (err) {
    // console.log(err);
    res.status(400).send({
      errorMessage: "알 수 없는 오류가 발생 하였습니다.",
    });
  }
});

app.get("/filtering/sub1/country", async (req, res) => {
  try {
    var { countryName } = req.query;
    const land = await Join.findAll({
      attributes: ["countryName", "purpose"],
      where: {
        countryName: countryName,
      },
    });
    return res.status(200).json({
      land,
    });
  } catch (err) {
    // console.log(err);
    res.status(401).send({
      errorMessage: "Permission denied",
    });
  }
});

app.get("/filtering/sub1/target", async (req, res) => {
  try {
    var { purpose } = req.query;
    const land = await Continent.findAll({
      attributes: ["purpose", "info"],
      where: {
        purpose: purpose,
      },
    });
    return res.status(200).json({
      land,
    });
  } catch (err) {
    // console.log(err);
    res.status(401).send({
      errorMessage: "Permission denied",
    });
  }
});

app.get("/filtering/sub2/country", async (req, res) => {
  try {
    var { targetName, countryName1, countryName2, countryName3, countryName4 } =
      req.query;
    if (!countryName2) {
      countryName2 = "a";
    }
    if (!countryName3) {
      countryName3 = "b";
    }
    if (!countryName4) {
      countryName4 = "c";
    }
    let countryList = await Join.findAll({
      attributes: ["countryName", "targetName"],
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { countryName: countryName1 },
              { targetName: targetName },
            ],
          },
          {
            [Op.and]: [
              { countryName: countryName2 },
              { targetName: targetName },
            ],
          },
          {
            [Op.and]: [
              { countryName: countryName3 },
              { targetName: targetName },
            ],
          },
          {
            [Op.and]: [
              { countryName: countryName4 },
              { targetName: targetName },
            ],
          },
        ],
      },
      include: [
        {
          attributes: ["countryId"],
          model: CountryName,
          as: "info",
          include: [
            {
              attributes: [targetName],
              model: Visa,
            },
            {
              attributes: [
                "bankRequirePaper",
                "mainBank",
                "bankStep",
                "bankCaution",
                "accountType",
                "name",
              ],
              model: Bank,
            },
            {
              attributes: ["standardTime", "name"],
              model: Time,
            },
            {
              attributes: ["trafficLaw", "name"],
              model: TrafficLaw,
            },
            {
              attributes: ["standardLanguage", "name"],
              model: Language,
            },
            {
              attributes: [
                "phoneOpeningMethod",
                "mainTelecom",
                "recommendPlan",
                "name",
              ],
              model: Phone,
            },
          ],
        },
      ],
    });
    return res.status(200).json({
      countryList,
    });
  } catch (err) {
    // console.log(err);
    res.status(400).send({
      errorMessage: "알 수 없는 에러발생",
    });
  }
});

app.get("/filtering/sub2/target", async (req, res) => {
  try {
    var { countryName, targetName1, targetName2, targetName3, targetName4 } =
      req.query;

    var targetNameList;
    if (targetName1) {
      targetNameList = [targetName1];
    }
    if (targetName2) {
      targetNameList = [targetName1, targetName2];
    }
    if (targetName3) {
      targetNameList = [targetName1, targetName2, targetName3];
    }
    if (targetName4) {
      targetNameList = [targetName1, targetName2, targetName3, targetName4];
    }
    switch (targetNameList.length) {
      case 1:
        var a = targetNameList[0];
        break;
      case 2:
        var a = targetNameList.slice(0, 2);
        break;
      case 3:
        var a = targetNameList.slice(0, 3);
        break;
      case 4:
        var a = targetNameList.slice(0, 4);
        break;
    }

    if (!targetName2) {
      targetName2 = "a";
    }
    if (!targetName3) {
      targetName3 = "b";
    }
    if (!targetName4) {
      targetName4 = "z";
    }

    let countryList = await Join.findAll({
      attributes: ["countryName", "targetName"],
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { countryName: countryName },
              { targetName: targetName1 },
            ],
          },
          {
            [Op.and]: [
              { countryName: countryName },
              { targetName: targetName2 },
            ],
          },
          {
            [Op.and]: [
              { countryName: countryName },
              { targetName: targetName3 },
            ],
          },
          {
            [Op.and]: [
              { countryName: countryName },
              { targetName: targetName4 },
            ],
          },
        ],
      },
      include: [
        {
          attributes: ["countryId"],
          model: CountryName,
          as: "info",
          include: [
            {
              attributes: a,
              model: Visa,
            },
            {
              attributes: [
                "bankRequirePaper",
                "mainBank",
                "bankStep",
                "bankCaution",
                "accountType",
                "name",
              ],
              model: Bank,
            },
            {
              attributes: ["standardTime", "name"],
              model: Time,
            },
            {
              attributes: ["trafficLaw", "name"],
              model: TrafficLaw,
            },
            {
              attributes: ["standardLanguage", "name"],
              model: Language,
            },
            {
              attributes: [
                "phoneOpeningMethod",
                "mainTelecom",
                "recommendPlan",
                "name",
              ],
              model: Phone,
            },
          ],
        },
      ],
    });
    return res.status(200).json({
      countryList,
    });
  } catch (err) {
    // console.log(err);
    res.status(401).send({
      errorMessage: "Permission denied",
    });
  }
});

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

app.listen(3000, () => console.log("start.."));
