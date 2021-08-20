const mongoose = require("mongoose");
const { Offer } = require("./Models/models");

module.exports.get = async () => {
  let foundOffer = await Offer.findById({
    _id: req.params.offerid,
  });

  res.json(foundOffer);
};

module.exports.getAllData = async () => {
  let foundOffer = await Offer.findById({
    _id: req.params.offerid,
  }).populate("user");

  res.json(foundOffer);
};

module.exports.all = async (req, res) => {
  let offers = await Offer.find();
  res.json(offers);
};

module.exports.create = async () => {
  let id = new mongoose.mongo.ObjectId();

  let offerParams = { ...req.body, _id: id };
  await Offer.create(offerParams);

  const user = await User.findById({
    _id: req.body.user,
  });
  user.offers.push(id);
  user.save();

  res.json(offerParams);
};
