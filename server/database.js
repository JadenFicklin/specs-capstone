require("dotenv").config();
const { PORT, DATABASE_URL } = process.env;
const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");
const { matchPath } = require("react-router-dom");
const { default: axios } = require("axios");
const { query } = require("express");
const _ = require("lodash");

const app = express();

app.use(express.json());
app.use(cors());

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

//endpoints

//1
//register
app.post("/api/register", async (req, res) => {
  const { username, firstname, lastname, password } = req.body;

  let userCheck = await sequelize.query(
    `SELECT username FROM users WHERE username='${username}'`
  );

  if (userCheck[0].length !== 0) {
    return res.send(false).status(200);
  } else {
    return sequelize
      .query(
        `INSERT INTO users (username, firstname, lastname, password, watched ) VALUES ('${username}', '${firstname}', '${lastname}', '${password}', ARRAY[''])`
      )
      .then((result) => res.send(true).status(200));
  }
});

//2
//login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const userCheck2 = await sequelize.query(
    `SELECT * FROM users WHERE username='${username}' AND password='${password}'`
  );
  if (userCheck2[0][0]) {
    res.send(true).status(200);
  } else {
    res.send(false).status(200);
  }
});

//3
//add video to database
app.post("/api/uploadvideo", async (req, res) => {
  const { url, name } = req.body;

  return sequelize
    .query(`INSERT INTO videos (url, name) VALUES ('${url}', '${name}')`)
    .then((result) => res.send(result).status(200));
});

//4
//capture video data
app.get("/api/capturevideos", async (req, res) => {
  return sequelize
    .query(`SELECT url FROM videos`)
    .then((result) => res.send(result[0]).status(200));
});

//5
//add to watched
app.post("/api/addtowatched", async (req, res) => {
  const { username, randomurl } = req.body;

  const getPastWatched = await sequelize.query(
    `SELECT watched FROM users WHERE username='${username}'`
  );
  const past = _.uniqBy(JSON.parse(getPastWatched[0][0].watched));
  const updatedWatchList = [...past];

  updatedWatchList.push(randomurl);
  console.log(updatedWatchList);

  return sequelize
    .query(
      `UPDATE users
    SET watched= '${JSON.stringify(updatedWatchList)}'
    WHERE username='${username}'`
    )
    .then((result) => res.send(result[0]).status(200));
});

//6
// getnewvid
app.get("/api/getnewvid", async (req, res) => {
  return sequelize
    .query(`SELECT url FROM videos`)
    .then((result) => res.send(result[0]).status(200));
});

//7
//pull the watched videos
app.post("/api/getwatched", async (req, res) => {
  const { username } = req.body;
  return sequelize
    .query(`SELECT watched FROM users WHERE username='${username}'`)
    .then((result) => res.send(result[0]).status(200));
});

//8
//video downvotes
app.post("/api/downvotevideo", async (req, res) => {
  const { url } = req.body;

  const grabVideosVotesNumber = await sequelize.query(
    //grab votes number
    `SELECT votes FROM videos WHERE url = '${url}'`
  );
  return sequelize // set votes = votes - 1
    .query(
      `UPDATE videos
  SET votes = ${grabVideosVotesNumber[0][0].votes - 1} 
  WHERE url='${url}'`
    )
    .then((result) => res.send(result[0]).status(200));
});
//9
//video upvotes
app.post("/api/upvotevideo", async (req, res) => {
  const { url } = req.body;

  const grabVideosVotesNumber = await sequelize.query(
    //grab votes number
    `SELECT votes FROM videos WHERE url = '${url}'`
  );
  return sequelize // set votes = votes - 1
    .query(
      `UPDATE videos
  SET votes = ${grabVideosVotesNumber[0][0].votes + 1} 
  WHERE url='${url}'`
    )
    .then((result) => res.send(result[0]).status(200));
});
//10
app.post("/api/getstats", async (req, res) => {
  const { url } = req.body;

  return sequelize
    .query(`SELECT * FROM videos WHERE url = '${url}'`)
    .then((result) => res.send(result[0]).status(200));
});

//#
//app listen
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//npm i sequelize pg pg-hstore axios dotenv express cors
