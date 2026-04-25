const { Router } = require("express");
const db = require("../db");

const router = Router();

//GET all assets
router.get("/", (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM asset").all();
    res.status(200).json({
      status: "success",
      data: { asset: rows },
    });
    console.log("API Called : Get all asset");
  } catch (error) {
    next(error);
  }
});

//CREATE an asset
router.post("/", (req, res, next) => {
  try {
    const { name, value, base_value, value_mode, networth_id } = req.body;
    const result = db.prepare(
      "INSERT INTO asset (name, value, base_value, value_mode, networth_id) VALUES (?,?,?,?,?)"
    ).run(name, value, base_value, value_mode || 'rm', networth_id || null);
    const row = db.prepare("SELECT * FROM asset WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({
      status: "success",
      data: { asset: row },
    });
    console.log("API Called : Add an asset");
  } catch (error) {
    next(error);
  }
});

//DELETE an asset
router.delete("/:id", (req, res, next) => {
  try {
    db.prepare("DELETE FROM asset WHERE id = ?").run(req.params.id);
    res.status(204).json({ status: "success" });
    console.log("API Called : Delete an asset");
  } catch (error) {
    next(error);
  }
});

//UPDATE an asset
router.put("/", (req, res, next) => {
  try {
    const { name, value, base_value, value_mode, networth_id, id } = req.body;
    db.prepare(
      "UPDATE asset SET name=?, value=?, base_value=?, value_mode=?, networth_id=? WHERE id=?"
    ).run(name, value, base_value, value_mode || 'rm', networth_id || null, id);
    const row = db.prepare("SELECT * FROM asset WHERE id = ?").get(id);
    res.status(200).json({
      status: "success",
      data: { asset: row },
    });
    console.log("API Called : Update an asset");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
