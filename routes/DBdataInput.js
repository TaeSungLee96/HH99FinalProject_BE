const express = require("express");
const router = express.Router();
const fs = require("fs");
const { Bank } = require("../models");
const { Phone } = require("../models");
const { Time } = require("../models");
const { Language } = require("../models");
const { TrafficLaw } = require("../models");
const { TotalVisa, BaseInfo } = require("../models");

// DB에 데이터를 넣기위한 API
router.post("/dataInput", async (req, res) => {
  // 1번 은행, 2번 휴대전화, 3번 표준시, 4번 통용어, 5번 교통법, 6번 취업비자, 7번 이민비자, 8번 워홀비자, 9번 유학비자, 10번 일반정보
  const caseNumber = 10;
  const bank = ["은행"];
  const phone = ["휴대전화"];
  const time = ["표준시"];
  const language = ["통용어"];
  const traffic = ["교통법"];
  const workVisa = ["취업비자"];
  const immigrationVisa = ["이민비자"];
  const workingHolidayVisa = ["워홀비자"];
  const studyVisa = ["유학비자"];
  const info = ["일반정보"];
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
            __dirname + `/../project/은행/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { title, info } = jsonFile;

          await Bank.create({
            title,
            info,
          });
        }
      }
      break;
    case 2:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < phone.length; j++) {
          const countryName = country[i] + "_" + phone[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/../project/휴대전화/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { title, info } = jsonFile;

          await Phone.create({
            title,
            info,
          });
        }
      }
      break;
    case 3:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < time.length; j++) {
          const countryName = country[i] + "_" + time[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/../project/표준시/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { title, info } = jsonFile;

          await Time.create({
            title,
            info,
          });
        }
      }
      break;
    case 4:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < language.length; j++) {
          const countryName = country[i] + "_" + language[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/../project/통용어/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { title, info } = jsonFile;

          await Language.create({
            title,
            info,
          });
        }
      }
      break;
    case 5:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < traffic.length; j++) {
          const countryName = country[i] + "_" + traffic[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/../project/교통법/${countryName}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { title, info } = jsonFile;

          await TrafficLaw.create({
            title,
            info,
          });
        }
      }
      break;
    case 6:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < workVisa.length; j++) {
          const countryName1 = country[i] + "_" + workVisa[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/../project/취업비자/${countryName1}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { title, info, category, countryName } = jsonFile;

          await TotalVisa.create({
            title,
            info,
            category,
            countryName,
          });
        }
      }
      break;
    case 7:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < immigrationVisa.length; j++) {
          const countryName1 = country[i] + "_" + immigrationVisa[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/../project/이민비자/${countryName1}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { title, info, category, countryName } = jsonFile;

          await TotalVisa.create({
            title,
            info,
            category,
            countryName,
          });
        }
      }
      break;
    case 8:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < workingHolidayVisa.length; j++) {
          const countryName1 =
            country[i] + "_" + workingHolidayVisa[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/../project/워홀비자/${countryName1}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { title, info, category, countryName } = jsonFile;

          await TotalVisa.create({
            title,
            info,
            category,
            countryName,
          });
        }
      }
      break;
    case 9:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < studyVisa.length; j++) {
          const countryName1 = country[i] + "_" + studyVisa[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/../project/유학비자/${countryName1}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { title, info, category, countryName } = jsonFile;

          await TotalVisa.create({
            title,
            info,
            category,
            countryName,
          });
        }
      }
      break;
    case 10:
      for (i = 0; i < country.length; i++) {
        for (j = 0; j < info.length; j++) {
          const countryName1 = country[i] + "_" + info[j] + ".json";
          const file = fs.readFileSync(
            __dirname + `/../project/일반정보/${countryName1}`,
            "utf-8"
          );
          const jsonFile = JSON.parse(file);
          const { countryName, baseInfo } = jsonFile;

          await BaseInfo.create({
            countryName,
            baseInfo,
          });
        }
      }
      break;
  }

  return res.status(200).json({
    success: "등록 완료",
  });
});

router.get("/test", async (req, res) => {
  const { test } = req.query;
  res.status(200).json({ test });
});

module.exports = router;
