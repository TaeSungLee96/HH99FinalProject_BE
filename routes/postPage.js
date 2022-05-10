const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const { Post } = require("../models");
const { Comment } = require("../models");
const { User } = require("../models");
const { Op } = require("sequelize");

const multipart = require("connect-multiparty");
const multipartMiddleWare = multipart({
  uploadDir: "uploads",
});

// 게시글 등록
router.post(
  "/create",
  multipartMiddleWare,
  authMiddleWare,
  async (req, res) => {
    try {
      const { title, content, continent, country, target } = req.body;
      const { userInfo } = res.locals;
      const { userId, userName } = userInfo;
      console.log(req.files.image);
      const postImageUrl = req.files.image.path.replace("uploads", "");
      const viewCount = 0;

      await Post.create({
        title,
        content,
        continent,
        country,
        target,
        userId,
        userName,
        postImageUrl,
        viewCount,
      });

      res.status(200).json({ msg: "posting create complete." });
    } catch (error) {
      console.log(error);
      console.log("postPage.js --> 게시글 등록에서 에러남");

      res.status(400).json({ msg: "알 수 없는 에러 발생" });
    }
  }
);

// 게시글 조회
// 댓글수 어떻게 내릴지 고민중
router.get("/totalRead", async (req, res) => {
  var { country, target } = req.query;

  if (!country) {
    country = "allCountry";
  }
  if (!target) {
    target = "allTarget";
  }

  try {
    // 게시글 내용 내려주기
    let PostList = await Post.findAll({
      logging: false,
      attributes: [
        "title",
        "content",
        "continent",
        "country",
        "target",
        "userId",
        "userName",
        "postImageUrl",
        "viewCount",
      ],
      where: {
        [Op.and]: [{ country }, { target }],
      },
      include: [
        {
          attributes: ["userName", "userImageUrl"],
          model: User,
        },
      ],
    });

    res.status(200).json({ PostList });
  } catch (error) {
    console.log(error);
    console.log("postPage.js --> 게시글 조회에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 게시글 세부조회
router.get("/detailRead", async (req, res) => {
  var { postId } = req.query;

  try {
    // 조회수 불러오기
    let viewCount = await Post.findOne({
      logging: false,
      attributes: ["viewCount"],
      where: { postId },
    });

    // 조회수 올리기
    await Post.update({
      viewCount: viewCount + 1,
      logging: false,
      attributes: ["viewCount"],
      where: { postId },
    });

    // 게시글 내용 내려주기
    let PostList = await Post.findAll({
      logging: false,
      attributes: [
        "title",
        "content",
        "continent",
        "country",
        "target",
        "userId",
        "postImageUrl",
        "viewCount",
      ],
      where: { postId },
      include: [
        {
          attributes: ["comment"],
          model: Comment,
        },
        {
          attributes: ["userName", "userImageUrl"],
          model: User,
        },
      ],
    });

    res.status(200).json({ PostList });
  } catch (error) {
    console.log(error);
    console.log("postPage.js --> 게시글 조회에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 게시글 업데이트 - 원본데이터 내려주기
router.get("/updateRawData", authMiddleWare, async (req, res) => {
  const { postId } = req.query;
  const { userInfo } = res.locals;
  const { userId, userName } = userInfo;

  try {
    let postList = await Post.findOne({
      logging: false,
      attributes: ["userId"],
      where: { postId },
    });

    // 카카오, 구글에서 제공한 userId와 postId로 DB에서 꺼내온 userId가 같은지 비교
    if (postList.userId === userId) {
      res.status(200).json({ postList });
    } else {
      res.status(403).json({ msg: "본인의 게시물이 아닙니다." });
    }
  } catch (error) {
    console.log(error);
    console.log(
      "postPage.js --> 게시글 업데이트-원본데이터 내려주기에서 에러남"
    );

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 게시글 업데이트
router.patch(
  "/update",
  multipartMiddleWare,
  authMiddleWare,
  async (req, res) => {
    try {
      const { title, content, continent, country, target, postId } = req.body;
      const { userInfo } = res.locals;
      const { userId, userName } = userInfo;

      const postImageUrl = req.files.image.path.replace("uploads", "");

      let postList = await Post.findOne({
        logging: false,
        attributes: ["userId"],
        where: { postId },
      });

      // 카카오, 구글에서 제공한 userId와 postId로 DB에서 꺼내온 userId가 같은지 비교
      if (postList.userId === userId) {
        await Post.update(
          {
            title,
            content,
            continent,
            country,
            target,
            userId,
            userName,
            postImageUrl,
            viewCount,
          },
          {
            where: {
              postId,
            },
          }
        );
        res.status(200).json({ msg: "posting update complete." });
      } else {
        res.status(403).json({ msg: "본인의 게시물이 아닙니다." });
      }
    } catch (error) {
      console.log(error);
      console.log("postPage.js --> 게시글 업데이트에서 에러남");

      res.status(400).json({ msg: "알 수 없는 에러 발생" });
    }
  }
);

// 게시글 삭제
router.delete("/delete", authMiddleWare, async (req, res) => {
  try {
    const { postId } = req.body;
    const { userInfo } = res.locals;
    const { userId, userName } = userInfo;

    let postList = await Post.findOne({
      logging: false,
      attributes: ["userId"],
      where: { postId },
    });

    // 카카오, 구글에서 제공한 userId와 postId로 DB에서 꺼내온 userId가 같은지 비교
    if (postList.userId === userId) {
      await Post.destroy({
        where: { postId },
      });
      res.status(200).json({ msg: "posting update complete." });
    } else {
      res.status(403).json({ msg: "본인의 게시물이 아닙니다." });
    }
  } catch (error) {
    console.log(error);
    console.log("postPage.js --> 게시글 삭제에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

module.exports = router;
