const mongoose = require("mongoose");
const cloudinary = require("../Util/cloudinary");
const fetch = require("node-fetch");
const { Offer, User } = require("../Models/models");

let perPage = 10;

// TODO: *****REMOVE PASSWORD HASH WHEN POPULATING****

module.exports.get = async (req, res) => {
  let foundOffer = await Offer.findById(req.params.offerid);

  res.json(foundOffer);
};

module.exports.geoSpatialGet = async (req, res) => {
  let { lat, long, distance = 2000 } = req.query;
  if (!lat || !long) return res.status(500).json({ error: "No coordinates" });
  if (lat === "undefined" || long === "undefined")
    return res.status(500).json({ error: "No coordinates" });
  if (distance === "undefined") distance = 2000;

  let foundOffers = await Offer.find({
    location: {
      $near: {
        $maxDistance: parseFloat(distance),
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(long), parseFloat(lat)],
        },
      },
    },
  });

  res.json(foundOffers);
};

module.exports.getAllData = async (req, res) => {
  let foundOffer = await Offer.findById(req.params.offerid)
    .populate({ path: "user", select: "-password_hash -email" })
    .populate("reviews");

  res.json(foundOffer);
};

module.exports.pageWithoutData = async (req, res) => {
  let page = req.query.page || 0;
  let offers = await Offer.find()
    .limit(perPage)
    .skip(perPage * page);
  res.json(offers);
};

module.exports.pageWithData = async (req, res) => {
  let page = req.query.page || 0;
  let offers = await Offer.find()
    .skip(perPage * page)
    .limit(perPage)
    .populate({ path: "user", select: "-password_hash -email" })
    .populate("reviews");
  res.json(offers);
};

module.exports.all = async (req, res) => {
  let offers = await Offer.find();
  res.json(offers);
};

module.exports.create = async (req, res) => {
  let id = new mongoose.mongo.ObjectId();

  let offerParams = { ...req.body, _id: id };
  let response = await fetch(
    `http://api.positionstack.com/v1/forward?access_key=${process.env.LOCATION_API_KEY}&query=${offerParams.address}`
  );
  let data = await response.json();
  let location = [data?.data[0]?.longitude, data?.data[0]?.latitude];
  offerParams.location = { type: "Point", coordinates: location };
  await Offer.create(offerParams);

  const user = await User.findById({
    _id: req.body.user,
  });
  user.offers.push(id);
  user.save();

  res.json(offerParams);
};

module.exports.image = async (req, res) => {
  try {
    const image = await cloudinary.uploader.upload(req.file.path, {
      public_id: req.params.offerid,
    });

    const data = { picture_url: image.secure_url };
    let doc = await User.findByIdAndUpdate(req.params.offerid, data, {
      new: true,
    });
    res.json(doc);
  } catch (e) {
    console.log(e);
    res.status(500).send("Failed");
  }
};

module.exports.update = async (req, res) => {
  let doc = await Offer.findByIdAndUpdate(req.params.offerid, req.body, {
    new: true,
  });
  res.json(doc);
};
