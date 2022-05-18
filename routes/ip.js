const express = require("express");
const router = express.Router();
const { Ip } = require("../models");

// FE가 정각마다 해당 API 호출하기
router.delete("/delete", async (req, res) => {
  try {
    await Ip.destroy({});
    res.status(200).json({ msg: "Ip 전체삭제 완료" });
  } catch (error) {
    console.log(error);
    console.log("ip.js --> 정각마다 ip삭제에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

module.exports = router;
