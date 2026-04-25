const networthRoutes = require("./networth");
const businessRoutes = require("./business");
const investmentRoutes = require("./investment");
const goalRoutes = require("./goal");
const skillRoutes = require("./skill");
const tradingRoutes = require("./trading");
const settingsRoutes = require("./settings");
const assetRoutes = require("./asset");

module.exports = (app) => {
  app.use("/networth", networthRoutes);
  app.use("/business", businessRoutes);
  app.use("/investment", investmentRoutes);
  app.use("/goal", goalRoutes);
  app.use("/skill", skillRoutes);
  app.use("/trading", tradingRoutes);
  app.use("/settings", settingsRoutes);
  app.use("/asset", assetRoutes);
};
