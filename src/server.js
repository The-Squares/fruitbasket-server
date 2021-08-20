const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const { User, Offer, Review } = require("./Models/models");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected!");
  }
);

// Client side validation (fix later)
app.post("/api/users", async (req, res) => {
  let id = new mongoose.mongo.ObjectId();

  let userParams = { ...req.body, _id: id };

  await User.create(userParams);
  res.json(userParams);
});

app.post("/api/offers", async (req, res) => {
  let id = new mongoose.mongo.ObjectId();

  let offerParams = { ...req.body, _id: id };
  await Offer.create(offerParams);

  const user = await User.findById({
    _id: req.body.user,
  });
  user.offers.push(id);
  user.save();

  res.json(offerParams);
});

app.post("/api/reviews", async (req, res) => {
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
});

app.get("/api/users/:userid", async (req, res) => {
  let foundUser = await User.findById({ _id: req.params.userid })
    .populate("offers")
    .populate("reviews");

  res.json(foundUser);
});

app.get("/api/offers/:offerid", async (req, res) => {
  let foundOffer = await Offer.findById({
    _id: req.params.offerid,
  }).populate("user");

  res.json(foundOffer);
});

app.get("/api/reviews/:reviewid", async (req, res) => {
  let foundReview = await Review.findById({
    _id: req.params.reviewid,
  })
    .populate("user")
    .populate("offer");

  res.json(foundReview);
});

app.listen(port, () => {
  console.log(`Started on http://localhost:${port}`);
});
