const { Router } = require("express");
const db = require("../db");

const router = Router();

//GET all investment_time
router.get("/time", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM investment_time").all();
    res.status(200).json({
      status: "success",
      data: { investment_time: rows },
    });
    console.log("API Called : Get all investment_time");
  } catch (error) {
    next(error);
  }
});

//CREATE a investment_time
router.post("/time", (req, res, next) => {
  try {
    const { investment_profit, total, capital, profit_percentage } = req.body;
    const result = db.prepare(
      "INSERT INTO investment_time (investment_profit, total, capital, profit_percentage) VALUES (?,?,?,?)"
    ).run(investment_profit, total, capital, profit_percentage);
    const row = db.prepare("SELECT * FROM investment_time WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { investment_time: row },
    });
    console.log("API Called : Add investment_time");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
