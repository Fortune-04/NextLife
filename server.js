require("dotenv").config();
const express = require("express");
const db = require("./db");
const cors = require("cors");
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//////////////////////////////////////////////NETWORTH//////////////////////////////////////////////
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
      "INSERT INTO networth (name, value, base_value, investment) VALUES ($1,$2,$3,$4) RETURNING *",
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
    const results = await db.query("DELETE FROM networth WHERE id =$1", [
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

//////////////////////////////////////////////NETWORTH_TIME///////////////////////////////////////////
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
      "INSERT INTO networth_time (total_networth, monthly_income, investment_profit, monthly_profit) VALUES ($1,$2,$3,$4) RETURNING *",
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

//////////////////////////////////////////////INVESTMENT_TIME///////////////////////////////////////////
//GET all investment_time
app.get("/investment/time", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM investment_time");
    res.status(200).json({
      status: "success",
      data: {
        investment_time: results.rows,
      },
    });
    console.log("API Called : Get all investment_time");
  } catch (error) {
    console.log(error);
  }
});

//CREATE a investment_time
app.post("/investment/time", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO investment_time (investment_profit, total, capital, profit_percentage) VALUES ($1,$2,$3,$4) RETURNING *",
      [
        req.body.investment_profit,
        req.body.total,
        req.body.capital,
        req.body.profit_percentage
      ]
    );
    res.status(201).json({
      status: "success",
      data: {
        investment_time: results.rows[0],
      },
    });
    console.log("API Called : Add invesment_time");
  } catch (error) {
    console.log(error);
  }
});

//////////////////////////////////////////////BUSINESS///////////////////////////////////////////////////////
//GET all business
app.get("/business", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM business");
    res.status(200).json({
      status: "success",
      data: {
        business: results.rows,
      },
    });
    console.log("API Called : Get all business");
  } catch (error) {
    console.log(error);
  }
});

//CREATE a business
app.post("/business", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO business (name, revenue, capital, status) VALUES ($1,$2,$3,$4) RETURNING *",
      [req.body.name, req.body.revenue, req.body.capital, req.body.status]
    );
    res.status(201).json({
      status: "success",
      data: {
        business: results.rows[0],
      },
    });
    console.log("API Called : Add a business");
  } catch (error) {
    console.log(error);
  }
});

//DELETE a business
app.delete("/business/:id", async (req, res) => {
  try {
    const results = await db.query("DELETE FROM business WHERE id =$1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
    });
    console.log("API Called : Delete a business");
  } catch (error) {
    console.log(error);
  }
});

//UPDATE a business
app.put("/business", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE business SET name=$1, revenue=$2, capital=$3, status=$4 WHERE id=$5 RETURNING *",
      [
        req.body.name,
        req.body.revenue,
        req.body.capital,
        req.body.status,
        req.body.id,
      ]
    );
    res.status(200).json({
      status: "success",
      data: {
        business: results.rows[0],
      },
    });
    console.log("API Called : Update a business");
  } catch (error) {
    console.log(error);
  }
});

//////////////////////////////////////////////BUSINESS_TIME///////////////////////////////////////////
//GET all business_time
app.get("/business/time", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM business_time");
    res.status(200).json({
      status: "success",
      data: {
        business_time: results.rows,
      },
    });
    console.log("API Called : Get all business_time");
  } catch (error) {
    console.log(error);
  }
});

//CREATE a business_time
app.post("/business/time", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO business_time (business_profit, total_revenue, total_capital, profit_percentage) VALUES ($1,$2,$3, $4) RETURNING *",
      [req.body.business_profit,req.body.total_revenue, req.body.total_capital, req.body.profit_percentage]
    );
    res.status(201).json({
      status: "success",
      data: {
        business_time: results.rows[0],
      },
    });
    console.log("API Called : Add business_time");
  } catch (error) {
    console.log(error);
  }
});

//////////////////////////////////////////////GOAL_ULTIMATE//////////////////////////////////////////////////
//GET all Goal_Ultimate
app.get("/goal/ultimate", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM goal_ultimate");
    res.status(200).json({
      status: "success",
      data: {
        goal_ultimate: results.rows,
      },
    });
    console.log("API Called : Get all goal_ultimate");
  } catch (error) {
    console.log(error);
  }
});

//CREATE a Goal_Ultimate
app.post("/goal/ultimate", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO goal_ultimate (name, target_value, current_value) VALUES ($1,$2,$3) RETURNING *",
      [
        req.body.name,
        req.body.target_value,
        req.body.current_value,
      ]
    );
    res.status(201).json({
      status: "success",
      data: {
        goal_ultimate: results.rows[0],
      },
    });
    console.log("API Called : Add a goal_ultimate");
  } catch (error) {
    console.log(error);
  }
});

//UPDATE a Goal_Ultimate
app.put("/goal/ultimate", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE goal_ultimate SET name=$1, target_value=$2, current_value=$3, image_source=$4, status=$5 WHERE id=$6 RETURNING *",
      [
        req.body.name,
        req.body.target_value,
        req.body.current_value,
        req.body.image_source,
        req.body.status,
        req.body.id
      ]
    );
    res.status(200).json({
      status: "success",
      data: {
        goal_ultimate: results.rows[0],
      },
    });
    console.log("API Called : Update a goal_ultimate");
  } catch (error) {
    console.log(error);
  }
});

//////////////////////////////////////////////GOAL_OTHER//////////////////////////////////////////////
//GET all Goal_Other
app.get("/goal/other", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM goal_other");
    res.status(200).json({
      status: "success",
      data: {
        goal_other: results.rows,
      },
    });
    console.log("API Called : Get all goal_other");
  } catch (error) {
    console.log(error);
  }
});

//CREATE a Goal_Other
app.post("/goal/other", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO goal_other (name, complete_status) VALUES ($1,$2) RETURNING *",
      [
        req.body.name,
        req.body.complete_status
      ]
    );
    res.status(201).json({
      status: "success",
      data: {
        goal_other: results.rows[0],
      },
    });
    console.log("API Called : Add a goal_other");
  } catch (error) {
    console.log(error);
  }
});

//DELETE a goal_other
app.delete("/goal/other/:id", async (req, res) => {
  try {
    const results = await db.query("DELETE FROM goal_other WHERE id =$1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
    });
    console.log("API Called : Delete a goal_other");
  } catch (error) {
    console.log(error);
  }
});

//////////////////////////////////////////////Skill_Type//////////////////////////////////////////////
//GET all Skill_Type
app.get("/skill/type", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM skill_type");
    res.status(200).json({
      status: "success",
      data: {
        skill_type: results.rows,
      },
    });
    console.log("API Called : Get all skill_type");
  } catch (error) {
    console.log(error);
  }
});

//CREATE a skill_type
app.post("/skill/type", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO skill_type (name) values ($1) RETURNING *",
      [req.body.name]
    );
    res.status(201).json({
      status: "success",
      data: {
        skill_type: results.rows[0],
      },
    });
    console.log("API Called : Add a skill_type");
  } catch (error) {
    console.log(error);
  }
});

//DELETE a skill_type
app.delete("/skill/type/:id", async (req, res) => {
  try {
    const results = await db.query("DELETE FROM skill_type WHERE id =$1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
    });
    console.log("API Called : Delete a skill_type");
  } catch (error) {
    console.log(error);
  }
});

//UPDATE a skill_type
app.put("/skill/type", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE skill_type SET name=$1 WHERE id=$2 RETURNING *",
      [
        req.body.name,
        req.body.id,
      ]
    );
    res.status(200).json({
      status: "success",
      data: {
        skill_type: results.rows[0],
      },
    });
    console.log("API Called : Update a skill_type");
  } catch (error) {
    console.log(error);
  }
});

//////////////////////////////////////////////Skill//////////////////////////////////////////////
//GET all Skill
app.get("/skill", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM skill");
    res.status(200).json({
      status: "success",
      data: {
        skill: results.rows,
      },
    });
    console.log("API Called : Get all skill");
  } catch (error) {
    console.log(error);
  }
});

//CREATE a Skill
app.post("/skill", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO skill (name, complete_status, skill_type_id) VALUES ($1,$2,$3) RETURNING *",
      [
        req.body.name,
        req.body.complete_status,
        req.body.skill_type_id
      ]
    );
    res.status(201).json({
      status: "success",
      data: {
        skill: results.rows[0],
      },
    });
    console.log("API Called : Add a skill");
  } catch (error) {
    console.log(error);
  }
});

//DELETE a Skill
app.delete("/skill/:id", async (req, res) => {
  try {
    const results = await db.query("DELETE FROM skill WHERE id =$1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "success",
    });
    console.log("API Called : Delete a skill");
  } catch (error) {
    console.log(error);
  }
});

//////////////////////////////////////////////TRADING_TIME///////////////////////////////////////////
//GET all trading_time
app.get("/trading/time", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM trading_time");
    res.status(200).json({
      status: "success",
      data: {
        trading_time: results.rows,
      },
    });
    console.log("API Called : Get all trading_time");
  } catch (error) {
    console.log(error);
  }
});

//CREATE a trading_time
app.post("/trading/time", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO trading_time (total, prev_profit, avg_profit, avg_profit_percentage, total_profit) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [
        req.body.total,
        req.body.prev_profit,
        req.body.avg_profit,
        req.body.avg_profit_percentage,
        req.body.total_profit,
      ]
    );
    res.status(201).json({
      status: "success",
      data: {
        trading_time: results.rows[0],
      },
    });
    console.log("API Called : Add a trading_time");
  } catch (error) {
    console.log(error);
  }
});

//Route
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});