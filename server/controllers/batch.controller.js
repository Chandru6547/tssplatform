const Batch = require("../models/Batch");

exports.createBatch = async (req, res) => {
  const batch = await Batch.create(req.body);
  res.status(201).json(batch);
};

exports.getBatches = async (req, res) => {
  const batches = await Batch.find();
  res.json(batches);
}

exports.getBatchesByYearAndCampus = async (req, res) => {
    console.log(req.query);
  const { year, campus } = req.query;
  const batches = await Batch.find( { Year: year, Campusname: campus } );
  res.json(batches);
}  