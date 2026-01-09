const Category = require("../models/Category");
const logger = require("../utils/logger");

exports.createCategory = async (req, res) => {
  logger.info("createCategory API called");
  try {
    const category = await Category.create(req.body);
    logger.success("Category created successfully");
    res.status(201).json(category);
  } catch (err) {
    logger.error("Error in createCategory: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCategoriesByCourse = async (req, res) => {
  logger.info("getCategoriesByCourse API called");
  try {
    const { courseId } = req.query;
    const categories = await Category.find({ courseId });
    logger.success("Categories retrieved successfully");
    res.json(categories);
  } catch (err) {
    logger.error("Error in getCategoriesByCourse: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};
