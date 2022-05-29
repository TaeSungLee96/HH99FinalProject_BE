const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const { Ip } = require("../models");

// FE가 정각마다 해당 API 호출하기
router.delete("/delete", async (req, res) => {
  console.log(req.ip);
  try {
    await Ip.destroy({
      where: {},
      truncate: true,
    });
    res.status(200).json({ msg: "Ip 전체삭제 완료" });
  } catch (error) {
    console.log(error);
    console.log("ip.js --> 정각마다 ip삭제에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

router.get("/test", async (req, res) => {
  if (req.ip == "::ffff:3.36.65.47") console.log("인증된 IP의 요청 입니다.");
  res.send("ok");
});

module.exports = router;
