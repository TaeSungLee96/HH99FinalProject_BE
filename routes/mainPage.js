const express = require("express");
const router = express.Router();
const { Continent } = require("../models");

// 메인페이지에서 나라별 필터링버튼을 누르면 호출되는 API
router.get("/allCountry", async (req, res) => {
  try {
    var land = await Continent.findAll({
      attributes: ["land"],
      where: {
        purpose: "all",
      },
    });
    land = land[0].land;
    return res.status(200).json({
      land,
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "알 수 없는 오류가 발생 하였습니다.",
    });
  }
});

module.exports = router;
