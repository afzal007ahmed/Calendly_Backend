const Meeting = require("../models/meetings");

const getBookingEndDateTime = (booking) => {
  const date = new Date(booking.date);
  const hours = Math.floor(booking.to / 60);
  const minutes = booking.to % 60;
  date.setHours(hours, minutes, 0, 0);
  return date;
};

exports.getMeetings = async (req, res, next) => {
  try {
    const { type } = req.query;

    if (!["upcoming", "past"].includes(type)) {
      const error = new Error("It should be either past or upcoming");
      error.statusCode = 400;
      error.code = "INVALID_QUERY";
      throw error;
    }

    const now = new Date();

    const hostId = req.user.id;

    const meetings = await Meeting.find().populate({
      path: "booking_id",
      match: { host_id: hostId },
    });

    const filteredMeetings = meetings.filter((m) => {
      if (!m.booking_id) return false;

      const end = getBookingEndDateTime(m.booking_id);

      if (type === "upcoming") {
        return end > now;
      }

      if (type === "past") {
        return end <= now;
      }

      return false;
    });

    return res.status(200).json({
      success: true,
      type,
      count: filteredMeetings.length,
      data: filteredMeetings,
    });
  } catch (err) {
    next(err);
  }
};

exports.testFetchMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();

    return res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
      error: err.message,
    });
  }
};
