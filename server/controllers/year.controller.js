const Year = require("../models/year");

exports.createYear = async (req, res) => {
  const year = await Year.create(req.body);
  res.status(201).json(year);
};

exports.getYears = async (req, res) => {
  const years = await Year.find();
  res.json(years);
}

exports.getYearsByCampus = async (req, res) => {
  const { campus } = req.query;
  const years = await Year.find( { Campusname: campus } );
  res.json(years);
}