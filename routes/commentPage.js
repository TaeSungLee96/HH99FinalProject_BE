const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const { Comment } = require("../models");
const { User } = require("../models");

// 댓글 등록 ##
router.post("/create", authMiddleWare, async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const { userInfo } = res.locals;
    const { userId, userName } = userInfo; // userName은 User 테이블에서 참조해올것

    if (!comment) {
      return res.status(400).json({ msg: "빈칸 없이 입력해주세요" });
    } else {
      await Comment.create({
        postId,
        comment,
        userId,
        userName,
      });
      res.status(200).json({ msg: "comment create complete." });
    }
  } catch (error) {
    console.log(error);
    console.log("commentPage.js --> 댓글 등록에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 댓글 조회 ##
// post.js 상세조회에서 대신 기능함

// 댓글 업데이트 - 원본데이터 내려주기 ##
router.get("/updateRawData", authMiddleWare, async (req, res) => {
  const { postId, commentId } = req.query;
  const { userInfo } = res.locals;
  const { userId, userName } = userInfo;

  try {
    let commentList = await Comment.findOne({
      logging: false,
      attributes: ["userId", "comment", "postId", "commentId"],
      where: { postId, commentId },
    });

    if (commentList) {
      // 카카오, 구글에서 제공한 userId와 postId로 DB에서 꺼내온 userId가 같은지 비교
      if (commentList.userId === userId) {
        res.status(200).json({ commentList });
      } else {
        res.status(403).json({ msg: "본인의 댓글이 아닙니다." });
      }
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
router.patch("/update", authMiddleWare, async (req, res) => {
  try {
    const { comment, commentId, postId } = req.body;
    const { userInfo } = res.locals;
    const { userId, userName } = userInfo;

    if (!comment) {
      return res.status(400).json({ msg: "빈칸 없이 입력해주세요" });
    }

    let commentList = await Comment.findOne({
      logging: false,
      attributes: ["userId"],
      where: { commentId },
    });
    if (commentList) {
      // 카카오, 구글에서 제공한 userId와 postId로 DB에서 꺼내온 userId가 같은지 비교
      if (commentList.userId === userId) {
        await Comment.update(
          { comment },
          {
            where: { postId, commentId },
          }
        );
        res.status(200).json({ msg: "comment update complete." });
      } else {
        res.status(403).json({ msg: "본인의 댓글이 아닙니다." });
      }
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
router.delete("/delete", authMiddleWare, async (req, res) => {
  try {
    const { commentId } = req.body;
    const { userInfo } = res.locals;
    const { userId, userName } = userInfo;

    let commentList = await Comment.findOne({
      logging: false,
      attributes: ["userId"],
      where: { commentId },
    });

    if (commentList) {
      // 카카오, 구글에서 제공한 userId와 postId로 DB에서 꺼내온 userId가 같은지 비교
      if (commentList.userId === userId) {
        await Comment.destroy({
          where: { commentId },
        });
        res.status(200).json({ msg: "comment delete complete." });
      } else {
        res.status(403).json({ msg: "본인의 댓글이 아닙니다." });
      }
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
