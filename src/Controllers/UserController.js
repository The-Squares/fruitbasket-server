const mongoose = require("mongoose");
const cloudinary = require("../Util/cloudinary");
const { User } = require("../Models/models");

module.exports.get = async (req, res) => {
  let foundUser = await User.findById(req.params.userid).select(
    "-password_hash"
  );

  res.json(foundUser);
};

module.exports.getOffers = async (req, res) => {
  let foundUser = await User.findById(req.params.userid)
    .select("-password_hash")
    .populate("offers");

  res.json(foundUser);
};

module.exports.getReviews = async (req, res) => {
  let foundUser = await User.findById(req.params.userid)
    .select("-password_hash")
    .populate("offers");

  res.json(foundUser);
};

module.exports.getAllData = async (req, res) => {
  let foundUser = await User.findById(req.params.userid)
    .select("-password_hash")
    .populate("offers")
    .populate("reviews");

  res.json(foundUser);
};

module.exports.all = async (req, res) => {
  let users = await User.find().select("-password_hash");
  res.json(users);
};

module.exports.create = async (req, res) => {
  let id = new mongoose.mongo.ObjectId();

  let userParams = { ...req.body, _id: id };

  await User.create(userParams);
  delete userParams["password_hash"];
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
    delete doc["password_hash"];
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
  delete doc[password_hash];
  res.json(doc);
};

module.exports.login = async (req, res) => {
  let { username, email, password_hash } = req.body;
  let loginDetail = username || email;
  if (!loginDetail)
    return res.code(400).send("Bad Request (no username or email)");
  let doc = await User.find({ username });
  if (!doc) return res.code(401).send("User does not exist");
  if (doc.password_hash !== password_hash)
    return res.code(401).send("Wrong password");
  res.send(doc);
};
