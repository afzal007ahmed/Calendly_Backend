const mongoose = require("mongoose");
const Availability = require("../models/availability");
const Users = require('../models/users')
const Schedule = require('../models/schedule');

const getAllSchedules = async (req, res) => {
  try {
    const userId = req.user?.id;
    if(!userId){
      return res.status(400).json({
          code: "INVALID_USER_ID",
          message: "Valid userId is required"
      });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const schedules = await Schedule.find({
      host_id: userObjectId
    }).populate({
      path: "host_id",
      select: "name email"
    });

    const availability = await Availability.find({
      user_id: userObjectId
    }).select("day from to -_id");

    const response = schedules.map((schedule) => ({
      _id: schedule._id,
      meeting_name: schedule.subject,
      duration: schedule.duration,
      type_of_meeting: schedule.type_of_meeting,
      availability,
      public_link: `/book/${schedule.host_id.name}/${schedule._id}`
    }));

    res.status(200).json({
      success: true,
      count: response.length,
      data: response
    });

  } catch (err) {
    err.statusCode = 500;
    err.code = "ERROR_GETTING_SCHEDULES";
    next(err);
  }
};

const getScheduleById = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const userId = req.user?.id; 

    if (
      !mongoose.Types.ObjectId.isValid(scheduleId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        code: "INVALID_ID",
        message: "Invalid scheduleId or userId"
      });
    }

    const scheduleObjectId = new mongoose.Types.ObjectId(scheduleId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const schedule = await Schedule.findOne({
      _id: scheduleObjectId,
      host_id: userObjectId
    }).populate({
      path: "host_id",
      select: "name email"
    });

    if (!schedule) {
      return res.status(404).json({
        code: "SCHEDULE_NOT_FOUND",
        message: "Schedule not found"
      });
    }

    const availability = await Availability.find({
      user_id: userObjectId
    }).select("day from to -_id");

    const response = {
      _id: schedule._id,
      meeting_name: schedule.subject,
      duration: schedule.duration,
      type_of_meeting: schedule.type_of_meeting,
      availability,
      public_link: `/book/${schedule.host_id.name}/${schedule._id}`
    };
    
    res.status(200).json({
      success: true,
      data: response
    });

  } catch (err) {
    err.statusCode = 500;
    err.code = "ERROR_GETTING_SCHEDULES";
    next(err);
  }
};

// check : remove if unused
const getDetailsofPublicLink = async (req, res) => {
  try {
    const { username, schedule_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(schedule_id)) {
      return res.status(400).json({
        code: "INVALID_SCHEDULE_ID",
        message: "Invalid schedule id",
      });
    }

    const user = await Users.findOne({ name: username }).select(
      "_id name email"
    );

    if (!user) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const schedule = await Schedule.findOne({
      _id: schedule_id,
      host_id: user._id,
    });

    if (!schedule) {
      return res.status(404).json({
        code: "SCHEDULE_NOT_FOUND",
        message: "Schedule not found",
      });
    }

    const availability = await Availability.find({
      user_id: user._id,
    }).select("day from to -_id");

    return res.status(200).json({
      success: true,
      data: {
        host: {
          name: user.name,
          email: user.email,
        },
        schedule: {
          id: schedule._id,
          meeting_name: schedule.subject,
          duration: schedule.duration,
          type_of_meeting: schedule.type_of_meeting,
        },
        availability,
      },
    });
  } catch (err) {
    err.statusCode = 500;
    err.code = "ERROR_GETTING_PUBLICLINK";
    next(err);
  }
};

const createSchedule = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { meeting_name, type_of_meeting, duration } = req.body;

    if (!userId) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const schedule = await Schedule.create({
      host_id: userId,                
      subject: meeting_name,
      duration: duration,
      type_of_meeting: type_of_meeting,
    });

    return res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    err.statusCode = 500;
    err.code = "ERROR_CREATING_SCHEDULES";
    next(err);
  }
};


module.exports = {
  getAllSchedules,
  getScheduleById,
  getDetailsofPublicLink,
  createSchedule
}