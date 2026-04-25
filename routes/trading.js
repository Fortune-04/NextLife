const { Router } = require("express");
const db = require("../db");

const router = Router();

//GET all trading_time
router.get("/time", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM trading_time").all();
    res.status(200).json({
      status: "success",
      data: { trading_time: rows },
    });
    console.log("API Called : Get all trading_time");
  } catch (error) {
    next(error);
  }
});

//CREATE a trading_time
router.post("/time", (req, res, next) => {
  try {
    const { total, profit_percentage, total_profit, prev_profit, avg_profit, avg_profit_percent } = req.body;
    const result = db.prepare(
      "INSERT INTO trading_time (total, profit_percentage, total_profit, prev_profit, avg_profit, avg_profit_percent) VALUES (?,?,?,?,?,?)"
    ).run(total, profit_percentage, total_profit, prev_profit, avg_profit, avg_profit_percent);
    const row = db.prepare("SELECT * FROM trading_time WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { trading_time: row },
    });
    console.log("API Called : Add a trading_time");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
