const express = require("express");
const mongoose = require("mongoose");
const multer = require("./Util/multer");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected!");
  }
);

const UserController = require("./Controllers/UserController");
const OfferController = require("./Controllers/OfferController");
const ReviewController = require("./Controllers/ReviewController");

app.post("/api/login", UserController.login);
app.get("/api/users", UserController.all);
app.get("/api/users/:userid", UserController.get);
app.get("/api/users/:userid/offers", UserController.getOffers);
app.get("/api/users/:userid/reviews", UserController.getReviews);
app.get("/api/users/:userid/all", UserController.getAllData);
app.post("/api/users", UserController.create);
app.post(
  "/api/users/:userid/image",
  multer.single("image"),
  UserController.image
);
app.patch("/api/users/:userid", UserController.update);
app.get("/api/offers/page", OfferController.pageWithoutData);
app.get("/api/offers/page/all", OfferController.pageWithData);
app.get("/api/offers", OfferController.all);
app.get("/api/offers/location", OfferController.geoSpatialGet);
app.get("/api/offers/search", OfferController.search);
app.get("/api/offers/:offerid", OfferController.get);
app.get("/api/offers/:offerid/all", OfferController.getAllData);
app.post("/api/offers", OfferController.create);
app.post(
  "/api/offers/:offerid/image",
  multer.single("image"),
  OfferController.image
);
app.patch("/api/users/:offerid", OfferController.update);

app.get("/api/reviews", ReviewController.all);
app.get("/api/reviews/:reviewid", ReviewController.get);
app.get("/api/offers/page", ReviewController.pageWithoutData);
app.get("/api/offers/page/all", ReviewController.pageWithoutData);
app.get("/api/reviews/:reviewid/all", ReviewController.getAllData);
app.post("/api/reviews", ReviewController.create);
app.patch("/api/users/:reviewid", ReviewController.update);

app.listen(port, () => {
  console.log(`Started on http://localhost:${port}`);
});
