const Year = require("../models/Year");
const logger = require("../utils/logger");

exports.createYear = async (req, res) => {
  logger.info("createYear API called");
  try {
    const year = await Year.create(req.body);
    logger.success("Year created successfully");
    res.status(201).json(year);
  } catch (err) {
    logger.error("Error in createYear: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getYears = async (req, res) => {
  logger.info("getYears API called");
  try {
    const years = await Year.find();
    logger.success("Years retrieved successfully");
    res.json(years);
  } catch (err) {
    logger.error("Error in getYears: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
}

exports.getYearsByCampus = async (req, res) => {
  logger.info("getYearsByCampus API called");
  try {
    const { campus } = req.query;
    const years = await Year.find( { Campusname: campus } );
    logger.success("Years by campus retrieved successfully");
    res.json(years);
  } catch (err) {
    logger.error("Error in getYearsByCampus: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
}