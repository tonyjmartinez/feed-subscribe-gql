const axios = require("axios");
const teams = require("./data/teams");
const _ = require("lodash");

const getNumberWithOrdinal = (n) => {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
const findTeam = (teams, teamId) =>
  _.find(teams, (team) => team.teamId === teamId);
const getGameState = (game) => {
  const { isGameActivated, period, clock, startTimeEastern, statusNum } = game;
  const currentPeriod = getNumberWithOrdinal(period.current);
  if (isGameActivated) {
    if (period.isHalftime) return "Halftime";
    if (period.isEndOfPeriod) return `End of the ${currentPeriod}`;
    if (statusNum === 1) return `Game Start`;
    if (period.current > 4) {
      return period.current === 5 ? "OT" : `${period.current - 4} OT`;
    }
    return `${clock} ${currentPeriod}`;
  }
  if (statusNum === 1) {
    return startTimeEastern;
  }
  if (statusNum === 3) {
    return "Final";
  }
};

module.exports.feed = async function (date) {
  const res = await axios.get(
    `http://data.nba.net/data/10s/prod/v1/${date}/scoreboard.json`
  );
  console.log("res?", res.data);
  const games = _.get(res, "data.games");
  const scores = games.map((game) => {
    const { hTeam, vTeam, isGameActivated } = game;
    const homeTeamInfo = findTeam(teams, hTeam.teamId);
    const visitingTeamInfo = findTeam(teams, vTeam.teamId);
    console.log("getgamestate", getGameState(game));
    const active = isGameActivated;
    return {
      gameState: getGameState(game),
      home: {
        score: hTeam.score,
        name: `${homeTeamInfo.tricode} ${homeTeamInfo.nickname}`,
        triCode: homeTeamInfo.tricode,
      },
      visitor: {
        score: vTeam.score,
        name: `${visitingTeamInfo.tricode} ${visitingTeamInfo.nickname}`,
        triCode: visitingTeamInfo.tricode,
      },
      active,
    };
  });

  return {
    games: scores,
  };
};
