const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

exports.getCategoriesByCourse = async (req, res) => {
  const { courseId } = req.query;
  const categories = await Category.find({ courseId });
  res.json(categories);
};
