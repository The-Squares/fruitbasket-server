const mongoose = require("mongoose");
const cloudinary = require("../Util/cloudinary");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const { User } = require("../Models/models");
const bufferToStream = require("../Util/bufferToStream");
const sharp = require("sharp");

const saltRounds = 10;

module.exports.get = async (req, res) => {
  let foundUser = await User.findById(req.params.userid).select(
    "-password_hash -email"
  );

  res.json(foundUser);
};

module.exports.getOffers = async (req, res) => {
  let foundUser = await User.findById(req.params.userid)
    .select("-password_hash -email")
    .populate("offers");

  res.json(foundUser);
};

module.exports.getReviews = async (req, res) => {
  let foundUser = await User.findById(req.params.userid)
    .select("-password_hash -email")
    .populate("offers");

  res.json(foundUser);
};

module.exports.getAllData = async (req, res) => {
  let foundUser = await User.findById(req.params.userid)
    .select("-password_hash -email")
    .populate("offers")
    .populate("reviews");

  res.json(foundUser);
};

module.exports.all = async (req, res) => {
  let users = await User.find().select("-password_hash -email");
  res.json(users);
};

module.exports.create = async (req, res) => {
  let id = new mongoose.mongo.ObjectId();

  let salt = await bcrypt.genSalt(saltRounds);
  let password_hash = await bcrypt.hash(req.body.password, salt);
  delete req.body.password;

  let userParams = { ...req.body, _id: id };
  userParams["password_hash"] = password_hash;

  await User.create(userParams);
  delete userParams["password_hash"];
  delete userParams["email"];
  res.json(userParams);
};

module.exports.image = async (req, res) => {
  try {
    let dimensions = JSON.parse(req.body.dimensions);
    const data = await sharp(req.file.path).extract(dimensions).toBuffer();
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: req.params.userid,
      },
      async (error, result) => {
        if (error) throw error;

        const data = { profile_picture_url: result.secure_url };
        let doc = await User.findByIdAndUpdate(req.params.userid, data, {
          new: true,
        });
        delete doc["password_hash"];
        delete doc["email"];
        res.json(doc);
      }
    );
    bufferToStream(data).pipe(stream);
  } catch (e) {
    console.log(e);
    res.status(500).send("Failed");
  }
};

module.exports.update = async (req, res) => {
  if (req.body.password_hash) return res.status(401).send("Do not change hash");
  let doc = await User.findByIdAndUpdate(req.params.userid, req.body, {
    new: true,
  });
  delete doc["password_hash"];
  delete doc["email"];
  res.json(doc);
};

module.exports.login = async (req, res) => {
  let { username, email, password } = req.body;
  let loginDetail = username || email;
  if (!loginDetail)
    return res.status(400).send("Bad Request (no username or email)");
  let loginObj = !username ? { email: email } : { username: username };
  let doc = await User.findOne(loginObj);
  if (!doc) return res.status(401).send("User does not exist");
  if (!(await promisify(bcrypt.compare)(password, doc.password_hash)))
    return res.status(401).send("Incorrect password");
  delete doc["password_hash"];
  delete doc["email"];
  res.send(doc);
};
