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

// 게시글 등록 ##
router.post(
  "/create",
  multipartMiddleWare,
  authMiddleWare,
  async (req, res) => {
    try {
      const { title, subTitle, content, continent, target } = req.body;
      const { userInfo } = res.locals;
      const { userId, userName } = userInfo;

      // 이미지를 업로드 해준경우
      if (req.files.image) {
        var postImageUrl = req.files.image.path.replace("uploads", "");
      }
      // 이미지를 업로드 안해준경우
      else {
        var postImageUrl = null;
      }

      // penalty(INT)값 찾기
      const penaltyInfo = User.findOne({
        logging: false,
        attributes: ["penalty", "penaltedAt"],
        where: {
          userId,
        },
      });
      console.log("penaltyInfo", penaltyInfo);
      let { penalty } = penaltyInfo.dataValues;
      let { penaltedAt } = penaltyInfo.dataValues;

      // penalty 기간정의
      let penaltyDifference = penaltedAt - new Date();
      // 벤 기간이 3일 이하이면 에러 발생시키기
      if (penaltyDifference <= 259200000) {
        res
          .status(401)
          .json({ msg: "임시정지 기간인 3일이 경과하지 않았습니다." });
      }
      // 벤 기간이 3일 초과라면 penalty 값 0으로 초기화해주기
      else {
        User.update(
          {
            penalty: 0,
          },
          { where: { userId } }
        );
      }

      // penalty(INT)값이 10이상이면 3일 벤처리
      if (penalty >= 10) {
        User.update(
          {
            penaltedAt: new Date(),
          },
          {
            where: { userId },
          }
        );
        res
          .status(401)
          .json({ msg: "3일간 게시글 등록 및 댓글 작성이 제한됩니다." });
      }

      // 게시글 도배감지 알고리즘
      let timeObject = await Post.findOne({
        logging: false,
        attributes: ["createdAt"],
        where: {
          userId,
        },
        order: [["createdAt", "DESC"]],
      });

      // 게시글 등록 간격시간 계산
      nowTime = new Date();
      createTime = timeObject.dataValues.createdAt;
      const difference = nowTime - createTime;

      // 60000ms = 60s = 1min
      if (difference < 120000) {
        User.update(
          {
            penalty: penalty + 1,
          },
          {
            where: { userId },
          }
        );
        res.status(401).json({ msg: "도배하지마요" });
        // 여기서 도배카운트 +1 해서 DB에 저장하는로직추가예정
      }

      // 게시글 등록
      const viewCount = 0;
      await Post.create({
        title,
        subTitle,
        content,
        continent,
        target,
        userId,
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

// 게시글 조회 ##
// 댓글수 어떻게 내릴지 고민중
router.get("/totalRead", async (req, res) => {
  var { continent, target, searchWord } = req.query;
  // 필터링 기능구현 로직(검색어가 없는 경우)
  if (continent && target && !searchWord) {
    condition = { continent, target };
  }
  if (
    (!continent && target && !searchWord) ||
    (continent == "모든대륙" && target && !searchWord)
  ) {
    condition = { target };
  }
  if (
    (continent && !target && !searchWord) ||
    (continent && target == "모든목적" && !searchWord)
  ) {
    condition = { continent };
  }
  if (
    (!continent && !target && !searchWord) ||
    (!continent && target == "모든목적" && !searchWord) ||
    (continent == "모든대륙" && !target && !searchWord) ||
    (continent == "모든대륙" && target == "모든목적" && !searchWord)
  ) {
    condition = {
      viewCount: { [Op.gte]: 0 },
    };
  }
  // 필터링 기능구현 로직(검색어가 있는 경우)
  if (continent && target && searchWord) {
    condition = {
      continent,
      target,
      [Op.or]: [
        {
          title: {
            [Op.substring]: searchWord,
          },
        },
        {
          subTitle: {
            [Op.substring]: searchWord,
          },
        },
        {
          content: {
            [Op.substring]: searchWord,
          },
        },
      ],
    };
  }
  if (!continent && target && searchWord) {
    condition = {
      target,
      [Op.or]: [
        {
          title: {
            [Op.substring]: searchWord,
          },
        },
        {
          subTitle: {
            [Op.substring]: searchWord,
          },
        },
        {
          content: {
            [Op.substring]: searchWord,
          },
        },
      ],
    };
  }
  if (continent && !target && searchWord) {
    condition = {
      continent,
      [Op.or]: [
        {
          title: {
            [Op.substring]: searchWord,
          },
        },
        {
          subTitle: {
            [Op.substring]: searchWord,
          },
        },
        {
          content: {
            [Op.substring]: searchWord,
          },
        },
      ],
    };
  }
  if (!continent && !target && searchWord) {
    condition = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: searchWord,
          },
        },
        {
          subTitle: {
            [Op.substring]: searchWord,
          },
        },
        {
          content: {
            [Op.substring]: searchWord,
          },
        },
      ],
    };
  }

  try {
    // 게시글 내용 내려주기
    let postList = await Post.findAll({
      // logging: false,
      attributes: [
        "postId",
        "title",
        "content",
        "continent",
        "subTitle",
        "target",
        "userId",
        "postImageUrl",
        "viewCount",
      ],
      where: condition,
      include: [
        {
          attributes: ["userName", "userImageUrl"],
          model: User,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // 게시물이 있는 경우
    if (postList) {
      res.status(200).json({ postList });
    }
    // 게시물이 없는 경우
    else {
      res.status(404).json({ msg: "해당 게시물이 존재하지 않습니다." });
    }
  } catch (error) {
    console.log(error);
    console.log("postPage.js --> 게시글 조회에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 게시글 세부조회 ##
router.get("/detailRead", async (req, res) => {
  var { postId } = req.query;

  try {
    // 조회수 불러오기
    let postInfo = await Post.findOne({
      logging: false,
      attributes: ["viewCount"],
      where: { postId },
    });

    // 해당 게시물이 있는경우
    if (postInfo) {
      let viewCount = postInfo.dataValues.viewCount;

      // 조회수 올리기
      await Post.update(
        {
          viewCount: viewCount + 1,
        },
        { where: { postId } }
      );

      // 게시글 내용 내려주기
      postList = await Post.findAll({
        logging: false,
        attributes: [
          "postId",
          "title",
          "content",
          "continent",
          "subTitle",
          "target",
          "userId",
          "postImageUrl",
          "viewCount",
        ],
        where: { postId },
        include: [
          {
            attributes: ["commentId", "comment", "userId", "userName"],
            model: Comment,
          },
          {
            attributes: ["userName", "userImageUrl"],
            model: User,
          },
        ],
      });

      res.status(200).json({ postList });
    }
    // 해당 게시물이 없는경우
    else {
      res.status(404).json({ msg: "해당 게시물이 존재하지 않습니다." });
    }
  } catch (error) {
    console.log(error);
    console.log("postPage.js --> 게시글 조회에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 게시글 업데이트 - 원본데이터 내려주기 ##
router.get("/updateRawData", async (req, res) => {
  const { postId } = req.query;

  try {
    // postId에 해당하는 userId 찾기
    const verifyUser = await Post.findOne({
      logging: false,
      attributes: ["userId"],
      where: { postId },
    });

    // 해당 게시물이 있는 경우
    if (verifyUser) {
      const postList = await Post.findOne({
        logging: false,
        where: { postId },
      });
      res.status(200).json({ postList });
    }
    // 해당 게시물이 없는 경우
    else {
      res.status(404).json({ msg: "해당 게시물이 존재하지 않습니다." });
    }
  } catch (error) {
    console.log(error);
    console.log(
      "postPage.js --> 게시글 업데이트-원본데이터 내려주기에서 에러남"
    );

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 게시글 업데이트 ##
router.patch("/update", multipartMiddleWare, async (req, res) => {
  try {
    const { title, subTitle, content, continent, target, postId } = req.body;

    // 이미지를 업로드 해준경우
    if (req.files.image) {
      var postImageUrl = req.files.image.path.replace("uploads", "");
    }
    // 이미지를 업로드 안해준경우(기본이미지 적용)
    else {
      var postImageUrl =
        "https://countryimage.s3.ap-northeast-2.amazonaws.com/A-fo_default.jpg";
    }

    // postId에 해당하는 userId 찾기
    let verifyUser = await Post.findOne({
      logging: false,
      attributes: ["userId"],
      where: { postId },
    });

    // 해당게시물이 있는경우
    if (verifyUser) {
      await Post.update(
        {
          title,
          subTitle,
          content,
          continent,
          target,
          userId,
          userName,
          postImageUrl,
          createdAt: new Date(),
        },
        {
          where: {
            postId,
          },
        }
      );
      res.status(200).json({ msg: "posting update complete." });
    }
    // 해당게시물이 없는경우
    else {
      res.status(404).json({ msg: "해당 게시물이 존재하지 않습니다." });
    }
  } catch (error) {
    console.log(error);
    console.log("postPage.js --> 게시글 업데이트에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

// 게시글 삭제 ##
router.delete("/delete", async (req, res) => {
  try {
    let { postId } = req.query;

    let verifyUser = await Post.findOne({
      logging: false,
      attributes: ["userId"],
      where: { postId: Number(postId) },
    });

    // 게시물이 있는 경우
    if (verifyUser) {
      // 카카오, 구글에서 제공한 userId와 postId로 DB에서 꺼내온 userId가 같은지 비교
      await Post.destroy({
        where: { postId },
      });
      res.status(200).json({ msg: "posting delete complete." });
    }
    // 게시물이 없는 경우
    else {
      res.status(404).json({ msg: "해당 게시물이 존재하지 않습니다." });
    }
  } catch (error) {
    console.log(error);
    console.log("postPage.js --> 게시글 삭제에서 에러남");

    res.status(400).json({ msg: "알 수 없는 에러 발생" });
  }
});

module.exports = router;
