const mongoose = require("mongoose");

const bookingsSchema = mongoose.Schema(
  {
    guest: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        note: { type: String },
      },
    ],
    from: {
      type: Number,
      required: true,
    },
    to: {
      type: Number,
      required: true,
    },
    schedule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
    },
    meeting_id: {
      type: String,
      required: true,
    },
    host_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookings", bookingsSchema);
