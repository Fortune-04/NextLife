const { Router } = require("express");
const db = require("../db");

const router = Router();

//DELETE all data (reset)
router.delete("/reset", (req, res, next) => {
  try {
    const tables = [
      "networth",
      "networth_time",
      "business",
      "business_time",
      "investment_time",
      "trading_time",
      "goal_ultimate",
      "goal_other",
      "skill",
      "skill_type",
    ];

    const deleteAll = db.transaction(() => {
      for (const table of tables) {
        db.prepare(`DELETE FROM ${table}`).run();
      }
    });

    deleteAll();

    res.status(200).json({
      status: "success",
      message: "All data has been reset",
    });
    console.log("API Called : Reset all data");
  } catch (error) {
    next(error);
  }
});

//EXPORT all data (backup)
router.get("/backup", (req, res, next) => {
  try {
    const tables = [
      "networth",
      "networth_time",
      "business",
      "business_time",
      "investment_time",
      "trading_time",
      "goal_ultimate",
      "goal_other",
      "skill",
      "skill_type",
    ];

    const backup = {};
    for (const table of tables) {
      backup[table] = db.prepare(`SELECT * FROM ${table}`).all();
    }

    res.status(200).json({
      status: "success",
      version: 1,
      timestamp: new Date().toISOString(),
      data: backup,
    });
    console.log("API Called : Backup all data");
  } catch (error) {
    next(error);
  }
});

//IMPORT all data (restore from backup)
router.post("/restore", (req, res, next) => {
  try {
    const { data, version } = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        status: "error",
        message: "Invalid backup file format",
      });
    }

    const tables = [
      "networth",
      "networth_time",
      "business",
      "business_time",
      "investment_time",
      "trading_time",
      "goal_ultimate",
      "goal_other",
      "skill",
      "skill_type",
    ];

    const restoreAll = db.transaction(() => {
      // Clear all tables first
      for (const table of tables) {
        db.prepare(`DELETE FROM ${table}`).run();
      }

      // Insert data for each table
      for (const table of tables) {
        const rows = data[table];
        if (!Array.isArray(rows) || rows.length === 0) continue;

        const columns = Object.keys(rows[0]);
        const placeholders = columns.map(() => "?").join(", ");
        const stmt = db.prepare(
          `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`
        );

        for (const row of rows) {
          stmt.run(...columns.map((col) => row[col]));
        }
      }
    });

    restoreAll();

    res.status(200).json({
      status: "success",
      message: "All data has been restored from backup",
    });
    console.log("API Called : Restore all data from backup");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
