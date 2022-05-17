const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const { Comment } = require("../models");
const { User } = require("../models");

// 댓글 등록 ##
router.post("/create", authMiddleWare, async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const { userInfo } = res.locals;
    const { userId, userName } = userInfo;

    if (!comment) {
      return res.status(400).json({ msg: "빈칸 없이 입력해주세요" });
    } else {
      await Comment.create({
        postId,
        comment,
        userId,
        userName,
      });

      const commentInfo = await Comment.findAll({
        logging: false,
        attributes: ["postId", "comment", "userId", "userName"],
        where: { postId },
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json({ commentInfo });
    }
  } catch (error) {
    console.log(error);
    console.log("commentPage.js --> 댓글 등록에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 댓글 조회 ##
router.get("/read", async (req, res) => {
  const { postId } = req.query;

  try {
    let commentList = await Comment.findOne({
      logging: false,
      attributes: ["userId", "comment", "postId", "commentId"],
      where: { postId: Number(postId) },
    });
    res.status(200).json({ commentList });
  } catch (error) {
    console.log(error);
    console.log("commentPage.js --> 댓글 조회에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 댓글 업데이트 - 원본데이터 내려주기 ##
router.get("/updateRawData", async (req, res) => {
  const { postId, commentId } = req.query;

  try {
    let commentList = await Comment.findOne({
      logging: false,
      attributes: ["userId", "comment", "postId", "commentId"],
      where: { postId, commentId },
    });

    if (commentList) {
      res.status(200).json({ commentList });
    } else {
      res.status(404).json({ msg: "해당 댓글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.log(error);
    console.log(
      "commentPage.js --> 댓글 업데이트-원본데이터 내려주기에서 에러남"
    );

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 댓글 업데이트 ##
router.patch("/update", async (req, res) => {
  try {
    const { comment, commentId, postId } = req.body;

    if (!comment) {
      return res.status(400).json({ msg: "빈칸 없이 입력해주세요" });
    }

    let commentList = await Comment.findOne({
      logging: false,
      attributes: ["userId"],
      where: { commentId },
    });
    if (commentList) {
      await Comment.update(
        { comment },
        {
          where: { postId, commentId },
        }
      );
      res.status(200).json({ msg: "comment update complete." });
    } else {
      res.status(404).json({ msg: "해당 댓글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.log(error);
    console.log("commentPage.js --> 댓글 업데이트에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 댓글 삭제 ##
router.delete("/delete", async (req, res) => {
  try {
    const { commentId } = req.query;

    let commentList = await Comment.findOne({
      logging: false,
      attributes: ["userId"],
      where: { commentId },
    });

    if (commentList) {
      await Comment.destroy({
        where: { commentId },
      });
      res.status(200).json({ msg: "comment delete complete." });
    } else {
      res.status(404).json({ msg: "해당 댓글이 존재하지 않습니다." });
    }
  } catch (error) {
    console.log(error);
    console.log("commentPage.js --> 댓글 삭제에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

module.exports = router;
