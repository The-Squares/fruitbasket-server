const mongoose = require("mongoose");
const { User } = require("./Models/models");

module.exports.get = async (req, res) => {
  let foundUser = await User.findById({ _id: req.params.userid });

  res.json(foundUser);
};

module.exports.getOffers = async (req, res) => {
  let foundUser = await User.findById({ _id: req.params.userid }).populate(
    "offers"
  );

  res.json(foundUser);
};

module.exports.getReviews = async (req, res) => {
  let foundUser = await User.findById({ _id: req.params.userid }).populate(
    "offers"
  );

  res.json(foundUser);
};

module.exports.getAllData = async (req, res) => {
  let foundUser = await User.findById({ _id: req.params.userid })
    .populate("offers")
    .populate("reviews");

  res.json(foundUser);
};

module.exports.all = async (req, res) => {
  let users = await User.find();
  res.json(users);
};

// Client side validation (fix later)
module.exports.create = async (req, res) => {
  let id = new mongoose.mongo.ObjectId();

  let userParams = { ...req.body, _id: id };

  await User.create(userParams);
  res.json(userParams);
};
