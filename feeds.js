const axios = require("axios");

module.exports.nba = async function (event, context) {
  console.log("queryStringParameters", event.queryStringParameters.date);
  const date = event.queryStringParameters.date;
  const res = await axios.get(
    `http://data.nba.net/data/10s/prod/v1/${date}/scoreboard.json`
  );
  console.log("res?", res.data);

  return {
    // return null to show no errors
    statusCode: 200, // http status code
    body: JSON.stringify({
      games: res.data,
    }),
  };
};
