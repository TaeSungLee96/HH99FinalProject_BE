try {
  var request = require("request");
  var moment = require("moment");
} catch (error) {
  console.log(error);
}

while (true) {
  const time = moment().format("HH");
  if (time === "14") {
    //delete요청
    request.delete(
      "https://a-fo-back.shop/ip/delete",
      function (err, res, body) {
        console.log(res);
      }
    );
  }
}
