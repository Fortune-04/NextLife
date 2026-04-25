try { require("dotenv").config(); } catch (_) { /* dotenv not available in production */ }
const express = require("express");
const cors = require("cors");
const registerRoutes = require("./routes");

const app = express();

//Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

//Routes
registerRoutes(app);

//Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

//Start server
const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});