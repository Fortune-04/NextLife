require("dotenv").config();
const express = require("express");
const db = require("./db");
const cors = require("cors");
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//NETWORTH
//GET all networth
app.get("/networth", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM networth");
    res.status(200).json({
      status: "success",
      data: {
        networth: results.rows,
      },
    });
    console.log("API Called : Get all networth");
  } catch (error) {
    console.log(error);
  }
});

//CREATE a networth
app.post("/networth", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO networth (name, value, base_value, investment) values ($1,$2,$3,$4) RETURNING *",
      [req.body.name, req.body.value, req.body.base_value, req.body.investment]
    );
    res.status(201).json({
      status: "success",
      data: {
        networth: results.rows[0],
      },
    });
    console.log("API Called : Add a networth");
  } catch (error) {
    console.log(error);
  }
});

//DELETE a networth
app.delete("/networth/:id", async (req, res) => {
  try {
    const results = await db.query("DELETE FROM networth where id =$1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
    });
    console.log("API Called : Delete a networth");
  } catch (error) {
    console.log(error);
  }
});

//UPDATE a networth
app.put("/networth", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE networth SET name=$1, value=$2, base_value=$3, investment=$4 WHERE id=$5 RETURNING *",
      [
        req.body.name,
        req.body.value,
        req.body.base_value,
        req.body.investment,
        req.body.id,
      ]
    );
    res.status(200).json({
      status: "success",
      data: {
        networth: results.rows[0],
      },
    });
    console.log("API Called : Update a networth");
  } catch (error) {
    console.log(error);
  }
});

//NETWORTH_TIME
//GET all networth_time
app.get("/networth/time", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM networth_time");
    res.status(200).json({
      status: "success",
      data: {
        networth_time: results.rows,
      },
    });
    console.log("API Called : Get all networth_time");
  } catch (error) {
    console.log(error);
  }
});

//CREATE a networth_time
app.post("/networth/time", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO networth_time (total_networth, monthly_income, investment_profit, monthly_profit) values ($1,$2,$3,$4) RETURNING *",
      [
        req.body.total_networth,
        req.body.monthly_income,
        req.body.investment_profit,
        req.body.monthly_profit,
      ]
    );
    res.status(201).json({
      status: "success",
      data: {
        networth_time: results.rows[0],
      },
    });
    console.log("API Called : Add a networth_time");
  } catch (error) {
    console.log(error);
  }
});

//Route
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
