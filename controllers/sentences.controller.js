const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

// Database configurations
const connection = require("../dbconnection/funsentencesdb");

// RESTful GET Call to Retrieve Word Lists
router.get("/word-types", async (req, res) => {
  try {
    const query = "SELECT * FROM funsentences.tblwordtypes";
    const { rows } = await connection.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving word types:", error);
    res.status(500).json({ error: "Failed to retrieve word types" });
  }
});

router.get("/words", async (req, res) => {
  const { type } = req.query;
  try {
    const query = "SELECT * FROM funsentences.tblwordlist WHERE type = $1";
    const { rows } = await connection.query(query, [type]);
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving words by type:", error);
    res.status(500).json({ error: "Failed to retrieve words by type" });
  }
});

// RESTful POST Call to Submit a New Sentence
router.post("/sentences", async (req, res) => {
  const { sentence } = req.body;
  try {
    const query =
      "INSERT INTO funsentences.tblsentences (sentence) VALUES ($1) RETURNING *";
    const { rows } = await connection.query(query, [sentence]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error submitting sentence:", error);
    res.status(500).json({ error: "Failed to submit sentence" });
  }
});

// RESTful GET Call to Retrieve Previously Submitted Sentences
router.get("/sentences", async (req, res) => {
  try {
    const query = "SELECT * FROM funsentences.tblsentences";
    const { rows } = await connection.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving sentences:", error);
    res.status(500).json({ error: "Failed to retrieve sentences" });
  }
});

module.exports = router;
