const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const md5 = require("md5");
const jwt = require("jsonwebtoken");
require("dotenv").config();
app.use(express.json());

// Create a new Pool instance using your PostgreSQL connection details
const connection = require("../dbconnection/funsentencesdb");

//access security
const INTERNAL_CLIENT_ID = process.env.INTERNAL_CLIENT_ID;
const SECRET_KEY = `${process.env.JWT_SECRET}`;
const CLIENT_ID = process.env.CLIENT_ID;

// Registration route handler
router.post("/register", async (req, res) => {
  const { fullname, username, password } = req.body;

  const hashed_password = md5(password.toString());
  const checkUser = `SELECT username FROM funsentences.tblfunsentencesusers WHERE username = $1`;

  try {
    const client = await connection.connect();
    const existingUser = await client.query(checkUser, [username]);

    if (existingUser.rowCount > 0) {
      return res.status(400).json({ status: 0, error: "User already exists" });
    }

    const sql = `INSERT INTO funsentences.tblfunsentencesusers (fullname, username, password) VALUES ($1, $2, $3) RETURNING *`;
    const values = [fullname, username, hashed_password];

    const result = await client.query(sql, values);
    const token = jwt.sign({ data: result.rows[0] }, SECRET_KEY);

    client.release();
    return res.status(201).json({ status: 1, data: result.rows[0], token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 0, error: "Unable to register: " + error.message });
  }
});

/**
 * login authorize and authenticate funsentences users
 */

router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body;

    const hashed_password = md5(password.toString());
    const sql = `SELECT * FROM funsentences.tblfunsentencesusers WHERE username = $1 AND password = $2`;
    connection.query(sql, [username, hashed_password], function (err, result) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        let token = jwt.sign({ data: result.rows }, SECRET_KEY);
        res.send({ status: 1, data: result.rows, token: token });
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

// Retrieve user profile route handler
router.get("/profile", async (req, res) => {
  try {
    // Check if user is authenticated
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ status: 0, message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, SECRET_KEY, async (error, decoded) => {
      if (error) {
        return res.status(401).json({ status: 0, message: "Unauthorized" });
      }

      const userName = decoded.data.username; // Assuming the user ID is stored in the JWT payload

      // Retrieve user profile from the database
      const sql = `SELECT * FROM funsentences.tblfunsentencesusers WHERE username = $1`;
      const result = await connection.query(sql, [userName]);

      if (result.rows.length === 0) {
        return res.status(404).json({ status: 0, message: "User not found" });
      }

      // Return the user profile
      const userProfile = result.rows[0];
      res.json({ status: 1, data: userProfile });
    });
  } catch (error) {
    console.error("Failed to retrieve user profile", error);
    res.status(500).json({ status: 0, error: "Internal Server Error" });
  }
});

module.exports = router;
