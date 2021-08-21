const mongoose = require("mongoose");
const cloudinary = require("../Util/cloudinary");
const { User } = require("../Models/models");

module.exports.get = async (req, res) => {
  let foundUser = await User.findById(req.params.userid);

  res.json(foundUser);
};

module.exports.getOffers = async (req, res) => {
  let foundUser = await User.findById(req.params.userid).populate("offers");

  res.json(foundUser);
};

module.exports.getReviews = async (req, res) => {
  let foundUser = await User.findById(req.params.userid).populate("offers");

  res.json(foundUser);
};

module.exports.getAllData = async (req, res) => {
  let foundUser = await User.findById(req.params.userid)
    .populate("offers")
    .populate("reviews");

  res.json(foundUser);
};

module.exports.all = async (req, res) => {
  let users = await User.find();
  res.json(users);
};

module.exports.create = async (req, res) => {
  let id = new mongoose.mongo.ObjectId();

  let userParams = { ...req.body, _id: id };

  await User.create(userParams);
  res.json(userParams);
};

module.exports.image = async (req, res) => {
  try {
    const image = await cloudinary.uploader.upload(req.file.path, {
      public_id: req.params.userid,
    });

    const data = { profile_picture_url: image.secure_url };
    let doc = await User.findByIdAndUpdate(req.params.userid, data, {
      new: true,
    });
    res.json(doc);
  } catch (e) {
    console.log(e);
    res.code(500).send("Failed");
  }
};

module.exports.update = async (req, res) => {
  let doc = await User.findByIdAndUpdate(req.params.userid, req.body, {
    new: true,
  });
  res.json(doc);
};
