const express = require("express");
const router = express.Router();
const { Continent, Join } = require("../models");

// 1번 시나리오, 목적 단일선택시 해당 목적의 나라들을 응답하는 API
router.get("/filtering/target", async (req, res) => {
  try {
    var { purpose } = req.query;
    var land = await Continent.findAll({
      logging: false,
      attributes: ["purpose", "land"],
      where: {
        purpose: purpose,
      },
    });
    purpose = land[0].purpose;
    land = land[0].land;
    return res.status(200).json({
      purpose,
      land,
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "Permission denied",
    });
  }
});

// 2번 시나리오, 나라 단일선택시 해당 나라의 목적들을 응답하는 API
router.get("/filtering/country", async (req, res) => {
  try {
    var { countryName } = req.query;
    const land = await Join.findAll({
      logging: false,
      attributes: ["countryName", "purpose", "service"],
      where: {
        countryName: countryName,
      },
    });
    return res.status(200).json({
      land,
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "Permission denied",
    });
  }
});

module.exports = router;
