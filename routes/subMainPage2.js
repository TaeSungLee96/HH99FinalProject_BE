const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { CountryName, TotalVisa, Join, BaseInfo } = require("../models");

// 1번 시나리오, 나라 다중선택시 비교데이터를 응답하는 API // 여기는 국기이미지 작은거
router.get("/filtering/country", async (req, res) => {
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
      // logging: false,
      attributes: [
        "countryName",
        "targetName",
        "flagSmall",
        "purpose",
        "purposeImg",
        "purposeImgSmall",
      ],
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
          attributes: ["title", "info"],
          model: TotalVisa,
          as: "visa",
        },
        {
          attributes: ["baseInfo"],
          model: BaseInfo,
        },
      ],
    });

    return res.status(200).json({
      countryList,
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "알 수 없는 에러발생",
    });
  }
});

// 2번 시나리오, 목적 다중선택시 비교데이터를 응답하는 API // 여기는 국기이미지 큰거
router.get("/filtering/target", async (req, res) => {
  try {
    var { countryName, targetName1, targetName2, targetName3, targetName4 } =
      req.query;

    var targetNameList;
    if (targetName1 !== "undefined" && targetName1) {
      targetNameList = [targetName1];
    }
    if (targetName2 !== "undefined" && targetName2) {
      targetNameList = [targetName1, targetName2];
    }
    if (targetName3 !== "undefined" && targetName3) {
      targetNameList = [targetName1, targetName2, targetName3];
    }
    if (targetName4 !== "undefined" && targetName4) {
      targetNameList = [targetName1, targetName2, targetName3, targetName4];
    }

    // switch (targetNameList.length) {
    //   case 1:
    //     var targetName = targetNameList;
    //     break;
    //   case 2:
    //     var targetName = targetNameList.slice(0, 2);
    //     break;
    //   case 3:
    //     var targetName = targetNameList.slice(0, 3);
    //     break;
    //   case 4:
    //     var targetName = targetNameList.slice(0, 4);
    //     break;
    // }

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
      logging: false,
      attributes: [
        "countryName",
        "targetName",
        "flag",
        "purpose",
        "purposeImgSmall",
      ],
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
          attributes: ["title", "info"],
          model: TotalVisa,
          as: "visa",
        },
        {
          attributes: ["baseInfo"],
          model: BaseInfo,
        },
      ],
    });
    return res.status(200).json({ countryList });
  } catch (err) {
    console.log(err);
    res.status(400).send({ errorMessage: "Permission denied" });
  }
});

module.exports = router;
