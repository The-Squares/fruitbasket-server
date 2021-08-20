const mongoose = require("mongoose");
const { Review } = require("../Models/models");

module.exports.get = async (req, res) => {
  let foundReview = await Review.findById(req.params.reviewid);

  res.json(foundReview);
};

module.exports.getAllData = async (req, res) => {
  let foundReview = await Review.findById(req.params.reviewid)
    .populate("user")
    .populate("offer");

  res.json(foundReview);
};

module.exports.all = async (req, res) => {
  let reviews = await Review.find();
  res.json(reviews);
};

module.exports.create = async (req, res) => {
  let id = new mongoose.mongo.ObjectId();

  let reviewParams = { ...req.body, _id: id };
  await Review.create(reviewParams);

  const user = await User.findById({
    _id: req.body.user,
  });
  user.reviews.push(id);
  user.save();

  const offer = await Offer.findById({
    _id: req.body.offer,
  });
  offer.reviews.push(id);
  offer.save();

  res.json(reviewParams);
};

module.exports.update = async (req, res) => {
  let doc = await Review.findByIdAndUpdate(req.params.reviewid, req.body, {
    new: true,
  });
  res.json(doc);
};
