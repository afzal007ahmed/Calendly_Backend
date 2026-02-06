const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema(
  {
    duration: {
      type: Number,
      required: true,
      min: 15,
      max: 720,
    },
    limit: {
      type: Number,
    },
    type_of_meeting: {
      type: String,
      enum: ["one", "group"],
      required: true,
    },
    host_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Schedule", scheduleSchema);
