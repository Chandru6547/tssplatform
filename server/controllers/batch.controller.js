const Batch = require("../models/Batch");
const logger = require("../utils/logger");

exports.createBatch = async (req, res) => {
  logger.info("createBatch API called");
  try {
    const batch = await Batch.create(req.body);
    logger.success("Batch created successfully");
    res.status(201).json(batch);
  } catch (err) {
    logger.error("Error in createBatch: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBatches = async (req, res) => {
  logger.info("getBatches API called");
  try {
    const batches = await Batch.find();
    logger.success("Batches retrieved successfully");
    res.json(batches);
  } catch (err) {
    logger.error("Error in getBatches: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
}

exports.getBatchesByYearAndCampus = async (req, res) => {
  logger.info("getBatchesByYearAndCampus API called");
  logger.info("Query parameters: " + JSON.stringify(req.query));
  const { year, campus } = req.query;
  try {
    const batches = await Batch.find( { Year: year, Campusname: campus } );
    logger.success("Batches retrieved successfully");
    res.json(batches);
  } catch (err) {
    logger.error("Error in getBatchesByYearAndCampus: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
}  