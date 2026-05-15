const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  cityId: Number,
  title: String,
  content: String,
  imageUrl: String,
  username: String,
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [String], // Beğenen kullanıcıların username listesi
    default: [],
  },
  savedBy: {
    type: [String], // Kaydeden kullanıcıların username listesi
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Route", RouteSchema);