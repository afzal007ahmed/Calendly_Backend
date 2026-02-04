const mongoose = require("mongoose");
const Availability = require("../models/availability");

const getAvailabilityforUser = async (req, res, next) => {
  try {
    const userId = req.user.id; 

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error("Valid userId is required");
      err.statusCode = 400;
      err.code = "INVALID_USER_ID";
      throw err;
    }

    const availability = await Availability.find({
      user_id: userId
    }).select("day from to -_id");

    const groupedAvailability = availability.reduce((acc, item) => {
      if (!acc[item.day]) {
        acc[item.day] = [];
      }
      acc[item.day].push({
        from: item.from,
        to: item.to
      });
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: groupedAvailability
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    err.code = err.code || "ERROR_GETTING_AVAILABILITY";
    next(err);
  }
};

const updateAvailability = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const allDays = req.body; 

    const updates = Object.keys(allDays).map(day => {
      const slot = allDays[day]?.[0];
      if (!slot) return null;
      return Availability.findOneAndUpdate(
        { user_id: userId, day },
        { $set: { from: slot.from, to: slot.to } },
        { upsert: true, new: true }
      );
    }).filter(Boolean);

    const results = await Promise.all(updates);

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

module.exports = {
    getAvailabilityforUser,
    updateAvailability
}