const request = require("request");
const moment = require("moment");

function scheduler() {
  //delete요청
  request.delete(
    {
      headers: { "content-type": "application/json" },
      url: "https://a-fo-back.shop/ip/delete",
      json: true,
    },
    function (error, response, body) {
      res.json(response);
    }
  );
}

while (true) {
  const time = moment().format("HH");
  if (time === "14") {
    scheduler();
  }
}
