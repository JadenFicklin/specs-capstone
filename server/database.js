require("dotenv").config();
const { PORT, DATABASE_URL } = process.env;
const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");
const { matchPath } = require("react-router-dom");

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

//register
//this will insert the users info into the users database (the first part of the conditional catchest if username already exists)
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
        `INSERT INTO users (username, firstname, lastname, password) VALUES ('${username}', '${firstname}', '${lastname}', '${password}')`
      )
      .then((result) => res.send(true).status(200));
  }
});

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

//upload video info to database video table
app.post("/api/uploadvideo", async (req, res) => {
  const { url, name } = req.body;

  return sequelize
    .query(`INSERT INTO videos (url, name) VALUES ('${url}', '${name}')`)
    .then((result) => res.send(result).status(200));
});

// get video from the database
// app.get("/api/getvideo", async (req, res) => {
//   return sequelize.query(`SELECT * FROM videos`).then((result) => {
//     res.send(result[0]).status(200);
//   });
// });

// set isloggedin equal to true on users table if user logs in && send all videourls to users videourl column
app.post("/api/isloggedin", async (req, res) => {
  const { username } = req.body;
  const getallURLS = await sequelize.query(`SELECT url FROM videos`);
  // console.log(getallURLS[0].length);   //will return 4
  // console.log(getallURLS[0][0].url);   //will return the url string of index 0
  const urlArr = [];
  for (let i = 0; i < getallURLS[0].length; i++) {
    urlArr.push(getallURLS[0][0].url);
  }

  return sequelize
    .query(
      `UPDATE users
    SET isloggedin=true, videourls='${urlArr}'
    WHERE username='${username}'
    `
    )
    .then((result) => res.send(result[0]).status(200));
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//npm i sequelize pg pg-hstore axios dotenv express cors
