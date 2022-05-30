const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const { Op } = require("sequelize");
const { DM } = require("../models");
const { Room } = require("../models");

// Room 리스트 호출하기
router.get("/list", async (req, res) => {
  const { targetAuthorId } = req.query;

  console.log(targetAuthorId);

  try {
    const DMList = await Room.findAll({
      logging: false,
      attribute: [
        "room",
        "author",
        "authorId",
        "targetAuthor",
        "targetAuthorId",
        "message",
        "updatedAt",
      ],
      where: {
        [Op.or]: [{ targetAuthorId }, { authorId: targetAuthorId }],
      },

      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json({ DMList });
  } catch (error) {
    console.log(error);
    console.log("dm.js --> DM 리스트 호출하기에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// DM 세부조회 하기
router.get("/detail", async (req, res) => {
  const { room } = req.query;
  try {
    const DMList = await DM.findAll({
      logging: false,
      attribute: [
        "room",
        "author",
        "authorId",
        "targetAuthor",
        "targetAuthorId",
        "message",
        "createdAt",
      ],
      where: { room },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ DMList });
  } catch (error) {
    console.log(error);
    console.log("dm.js --> DM 세부조회 하기에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

module.exports = router;
