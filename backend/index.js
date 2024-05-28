import express from "express";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.port;

app.use(bodyParser.json());

const dbConfig = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const db = await mysql.createConnection(dbConfig);

app.post("/shorten", async (req, res) => {
  const { original_url, short_name } = req.body;
  if (!original_url || !short_name) {
    return res.status(400).send({ message: "Missing data" });
  }

  try {
    const query = "Insert into urls (original_url, short-name) VALUES (?,?)";
    await db.execute(query, [original_url, short_name]);
    res.status(200).send({ message: `l.lb.ivao.aero/${shortname}` });
  } catch (err) {
    if (err.code == "ER_DUP_ENTRY") {
      res.status(400).send({ message: `shortname already exists` });
    } else {
      res.status(400).send({ message: `Error inserting to Database` });
    }
  }
});

app.get("/:short_name", async (req, res) => {
  const { short_name } = req.params;
  try {
    const query = "SELECT original_url from urls WHERE short_name = ?";
    const [results] = await db.execute(query, [short_name]);
    if (results.length == 0) {
      res.status(404).send({ message: `URL not found` });
    }
    res.status(200).send({ message: `${results[0].original_url}` });
  } catch (err) {
    res.status(500).send({ message: `error connecting to Database` });
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
