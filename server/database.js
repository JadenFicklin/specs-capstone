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
const bcrypt = require("bcrypt");
//added for hosting
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

//added for hosting
app.use(express.static(path.resolve(__dirname, "../build")));

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

  const hash = bcrypt.hashSync(password, 10);

  let userCheck = await sequelize.query(
    `SELECT username FROM users WHERE username='${username}'`
  );

  if (userCheck[0].length !== 0) {
    return res.send(false).status(200);
  } else {
    return sequelize
      .query(
        `INSERT INTO users (username, firstname, lastname, password) VALUES ('${username}', '${firstname}', '${lastname}', '${hash}')`
      )
      .then((result) => res.send(true).status(200));
  }
});
//login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  return sequelize
    .query(`SELECT * FROM users WHERE username='${username}'`)
    .then((result) => {
      if (result[1].rowCount) {
        if (bcrypt.compareSync(password, result[0][0].password)) {
          // .password breaks server if user inputs wrong username
          res.send(true).status(200);
        } else {
          res.send(false).status(200); //can you send back more than 2 things?
        }
      }
    });
});

//a
//get all database videos
app.get("/api/getdatabasevideos", async (req, res) => {
  return sequelize
    .query(`SELECT url FROM videos`)
    .then((result) => res.send(result[0]).status(200));
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

//add comment
app.post("/api/addcomment", async (req, res) => {
  const { vid, username, comment } = req.body;

  return sequelize
    .query(
      `INSERT INTO comments (comment, votes, video_id, username_id) VALUES ('${comment}',0,'${vid}','${username}')`
    )
    .then((result) => res.send(result[0]).status(200));
});

//display comments
app.post("/api/displaycomments", async (req, res) => {
  const { vid } = req.body;
  return await sequelize
    .query(
      `SELECT comment, username_id, votes FROM comments WHERE video_id='${vid}'`
    )
    .then((result) => res.send(result[0]).status(200));
});

//upvote click comments
app.post("/api/upvoteclick", async (req, res) => {
  const { comment } = req.body;

  const grabVotes = await sequelize.query(
    `SELECT votes FROM comments WHERE comment='${comment}'`
  );

  return await sequelize
    .query(
      `UPDATE comments SET votes=${
        grabVotes[0][0].votes + 1
      } WHERE comment='${comment}'`
    )
    .then((result) => res.send(result[0]).status(200));
});

//downvote click comments
app.post("/api/downvoteclick", async (req, res) => {
  const { comment } = req.body;

  const grabVotes = await sequelize.query(
    `SELECT votes FROM comments WHERE comment='${comment}'`
  );

  return await sequelize
    .query(
      `UPDATE comments SET votes=${
        grabVotes[0][0].votes - 1
      } WHERE comment='${comment}'`
    )
    .then((result) => res.send(result[0]).status(200));
});

//delete video if it has -2 votes
app.post("/api/deletevid", async (req, res) => {
  return sequelize
    .query(`DELETE FROM videos WHERE votes < -1`)
    .then(res.status(200));
});
//delete comment if it has -2 votes
app.post("/api/deletecomment", async (req, res) => {
  return sequelize
    .query(`DELETE FROM comments WHERE votes < -1`)
    .then(res.status(200));
});

//added for hosting
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

//#
//app listen
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//npm i sequelize pg pg-hstore axios dotenv express cors
