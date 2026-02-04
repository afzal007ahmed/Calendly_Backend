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
    const { day, from, to } = req.body;

    if (!day || from == null || to == null) {
      const err = new Error("day, from and to are required");
      err.statusCode = 400;
      err.code = "INVALID_INPUT";
      throw err;
    }

    const updatedAvailability = await Availability.findOneAndUpdate(
      {
        user_id: userId,
        day: day
      },
      {
        $set: {
          from: Number(from),
          to: Number(to)
        }
      },
      {
        new: true,
        upsert: true 
      }
    ).select("day from to -_id");

    res.status(200).json({
      success: true,
      data: updatedAvailability
    });

  } catch (err) {
    err.statusCode = err.statusCode || 500;
    err.code = err.code || "ERROR_UPDATING_AVAILABILITY";
    next(err);
  }
};


module.exports = {
    getAvailabilityforUser,
    updateAvailability
}