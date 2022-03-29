require("dotenv").config();
const { PORT, DATABASE_URL } = process.env;
const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");
const { matchPath } = require("react-router-dom");
const { default: axios } = require("axios");
const { query } = require("express");
const _ = require("lodash");
const { useRecoilStoreID } = require("recoil");

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
//login  ///////////////////////////////////////////////////////////////////////
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const userCheck2 = await sequelize.query(
    `SELECT * FROM users WHERE username='${username}' AND password='${password}'`
  );
  if (userCheck2[0][0]) {
    const geturls = await sequelize.query(`SELECT url FROM videos`);
    const holdAsArray = [];
    for (let i = 0; i < geturls[0].length; i++) {
      holdAsArray.push(geturls[0][i].url);
    }
    const holdAsString = holdAsArray.join(",");

    const update = sequelize.query(
      `UPDATE users SET vids='${holdAsString}' WHERE username = '${username}'`
    );
    res.send(true).status(200);
  } else {
    res.send(false).status(200);
  }
});

//b
//display random vid
app.post("/api/displayvideo", async (req, res) => {
  const { username } = req.body;

  const geturls = await sequelize.query(
    `SELECT vids FROM users WHERE username='${username}'`
  );
  const getString = geturls?.[0]?.[0]?.vids;
  if (getString) {
    const setBackToArray = getString.split(",");

    const updateArray = [];
    const undifinedArray = [];
    for (let i = 0; i < setBackToArray.length; i++) {
      if (setBackToArray[i] === "undefined") {
        undifinedArray.push(setBackToArray[i]);
      } else {
        updateArray.push(setBackToArray[i]);
      }
    }
    const randomVid =
      updateArray[Math.floor(Math.random() * updateArray.length)];

    return res.send(randomVid).status(200);
  } else {
    res.send([]).status(200);
  }
});
//c
//delete vid from user database
app.post("/api/deletevideo", async (req, res) => {
  const { username, vid } = req.body;
  const geturls = await sequelize.query(
    `SELECT vids FROM users WHERE username='${username}'`
  );
  const setBackToArray = geturls?.[0]?.[0]?.vids.split(",");
  const updateArray = [];
  const undifinedArray = [];
  for (let i = 0; i < setBackToArray.length; i++) {
    if (setBackToArray[i] === "undefined") {
      undifinedArray.push(setBackToArray[i]);
    } else {
      updateArray.push(setBackToArray[i]);
    }
  }
  const newArray = [];
  const oldArray = [];
  for (let i = 0; i < updateArray.length; i++) {
    if (updateArray[i] === vid) {
      oldArray.push(updateArray[i]);
    } else {
      newArray.push(updateArray[i]);
    }
  }
  const getWatched = await sequelize.query(
    `SELECT watched FROM users WHERE username='${username}'`
  );
  const previouslyWatched = getWatched[0][0].watched;

  const setUserVidsToNewString = sequelize.query(
    `UPDATE users SET vids='${newArray}' WHERE username = '${username}'`
  );
  const setUserWatchedToNewString = sequelize.query(
    `UPDATE users SET watched='${
      oldArray + "," + previouslyWatched
    }' WHERE username = '${username}'`
  );
});
//d
//grab new random vid and setVid to it
app.post("/api/getnewrandomvideo", async (req, res) => {
  const { username, vid } = req.body;

  const getvids = await sequelize.query(
    `SELECT vids FROM users WHERE username='${username}'`
  );
  const holdVids = getvids[0][0].vids;
  const splitVids = holdVids.split(",");
  const randomVid = splitVids[Math.floor(Math.random() * splitVids.length)];
  console.log(randomVid);
  return res.send(randomVid).status(200);
});
//e
//previousvid
app.post("/api/previousvid", async (req, res) => {
  const { username } = req.body;

  const geturl = await sequelize.query(
    `SELECT watched FROM users WHERE username='${username}'`
  );
  const getString = geturl[0][0].watched;
  const getArray = getString.split(",");
  const notWanted = [];
  const urls = [];
  for (let i = 0; i < getArray.length; i++) {
    if (getArray[i].includes("http")) {
      urls.unshift(getArray[i]);
    } else {
      notWanted.push(getArray[i]);
    }
  }
  const toString = urls.join(",");
  const mostRecentVideo = urls[0];
  const updatedWatched = sequelize.query(
    `UPDATE users SET watched='${toString}' WHERE username = '${username}'`
  );
  return res.send(mostRecentVideo).status(200);
});
//f
//removevidinfo
app.post("/api/removevidinfo", async (req, res) => {
  const removeVids = sequelize.query(`UPDATE users
  SET vids = null`);
  const removeWatched = sequelize.query(`UPDATE users
  SET watched = null`);
});

//3
//add video to database
app.post("/api/uploadvideo", async (req, res) => {
  const { url, name, username } = req.body;

  return sequelize
    .query(
      `INSERT INTO videos (url, name, votes ,username) VALUES ('${url}', '${name}', 0 ,'${username}')`
    )
    .then((result) => res.send(result).status(200));
});

//4
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
//5
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
//6
app.post("/api/getstats", async (req, res) => {
  const { url } = req.body;

  return sequelize
    .query(`SELECT * FROM videos WHERE url = '${url}'`)
    .then((result) => res.send(result[0]).status(200));
});

//7
//get all videos for top videos
app.get("/api/topvideos", async (req, res) => {
  return sequelize
    .query(`SELECT * FROM videos`)
    .then((result) => res.send(result[0]).status(200));
});

//add comments
app.post("/api/makecomment", async (req, res) => {
  const { username, vid, comment } = req.body;

  return sequelize
    .query(
      `INSERT INTO comments (comment, votes, video_id, username_id) VALUES ('${comment}', 0 ,'${vid}', '${username}')`
    )
    .then((result) => res.send(result[0]).status(200))
    .catch((err) => console.log(err));
});

//#
//app listen
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//npm i sequelize pg pg-hstore axios dotenv express cors
