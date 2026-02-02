const Meeting = require("../models/meetings");

const getBookingStartDateTime = (booking) => {
  const date = new Date(booking.date);
  const hours = Math.floor(booking.from / 60);
  const minutes = booking.from % 60;
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const getBookingEndDateTime = (booking) => {
  const date = new Date(booking.date);
  const hours = Math.floor(booking.to / 60);
  const minutes = booking.to % 60;
  date.setHours(hours, minutes, 0, 0);
  return date;
};

exports.getMeetings = async (req, res) => {
  try {
    const { type } = req.query;

    if (!["upcoming", "past"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "type must be upcoming or past",
      });
    }

    const now = new Date();

    const meetings = await Meeting.find().populate("booking_id");
    console.log(meetings);
    const filteredMeetings = meetings.filter((m) => {
      if (!m.booking_id) return false;

      const start = getBookingStartDateTime(m.booking_id);
      const end = getBookingEndDateTime(m.booking_id);

      if (type === "upcoming") {
        return m.status === false && end > now;
      }

      if (type === "past") {
        return m.status === true || end <= now;
      }
    });

    return res.status(200).json({
      success: true,
      type,
      count: filteredMeetings.length,
      data: filteredMeetings,
    });
  } catch (err) {
    console.error("GET MEETINGS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
      error: err.message,
    });
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
