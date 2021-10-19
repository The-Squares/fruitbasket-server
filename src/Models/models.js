const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: String,
  display_name: String,
  email: String,
  password_hash: String,
  profile_picture_url: String,
  volunteer: Boolean,
  offers: [{ type: Schema.Types.ObjectId, ref: "Offer" }],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

const OfferSchema = new Schema({
  _id: Schema.Types.ObjectId,
  address: String,
  price: Number,
  fruit_type: String,
  paypal_address: String,
  organic: Boolean,
  remaining: Number,
  timestamp: Number,
  picture_url: String,
  description: String,
  average_rating: Number,
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

const ReviewSchema = new Schema({
  _id: Schema.Types.ObjectId,
  rating: Number,
  comment: String,
  timestamp: Number,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  offer: { type: Schema.Types.ObjectId, ref: "Offer" },
});

const FoodbankSchema = new Schema({
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  link: String,
});

module.exports.User = mongoose.model("User", UserSchema);
module.exports.Offer = mongoose.model("Offer", OfferSchema);
module.exports.Review = mongoose.model("Review", ReviewSchema);
module.exports.Foodbank = mongoose.model("Foodbank", FoodbankSchema);
