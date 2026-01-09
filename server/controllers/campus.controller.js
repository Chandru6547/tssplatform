const Campus = require("../models/Campus");
const logger = require("../utils/logger");

exports.createCampus = async (req, res) => {
  logger.info("createCampus API called");
  try {
    const campus = await Campus.create(req.body);
    logger.success("Campus created successfully");
    res.status(201).json(campus);
  } catch (err) {
    logger.error("Error in createCampus: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCampuses = async (req, res) => {
  logger.info("getCampuses API called");
  try {
    const campuses = await Campus.find();
    logger.success("Campuses retrieved successfully");
    res.json(campuses);
  } catch (err) {
    logger.error("Error in getCampuses: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
}

