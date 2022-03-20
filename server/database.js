require("dotenv").config();
const { PORT, DATABASE_URL } = process.env;
const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");

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

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//npm i sequelize pg pg-hstore axios dotenv express cors
