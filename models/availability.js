const mongoose = require("mongoose");

const availabilitySchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required : true 
    },
    from: {
      type: Number,
      default: 9 * 60,
    },
    to: {
      type: Number,
      default: 17 * 60,
    },
    day: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Availability", availabilitySchema);
