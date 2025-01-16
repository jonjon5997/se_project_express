const mongoose = require("mongoose");
const validator = require("validator");

const weatherTypes = {
  HOT: "hot",
  WARM: "warm",
  COLD: "cold",
};

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: Object.values(weatherTypes),
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not valid",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // References a user
    ref: "user", // Name of the related model
    required: true, // Owner is mandatory
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, // Array of user IDs
      ref: "user", // Name of the related model
      default: [], // Defaults to an empty array
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
});

module.exports = mongoose.model("clothing", clothingItem);
