const Campus = require("../models/Campus");

exports.createCampus = async (req, res) => {
  const campus = await Campus.create(req.body);
  res.status(201).json(campus);
};

exports.getCampuses = async (req, res) => {
  const campuses = await Campus.find();
  res.json(campuses);
}

