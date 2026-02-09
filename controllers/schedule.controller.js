const mongoose = require("mongoose");
const Availability = require("../models/availability");
const Bookings = require("../models/bookings");
const Users = require("../models/users");
const Schedule = require("../models/schedule");

const getAllSchedules = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        code: "INVALID_USER_ID",
        message: "Valid userId is required",
      });
    }

    const schedules = await Schedule.find({
      host_id: userId,
      isDeleted: false,
    }).populate({
      path: "host_id",
      select: "name email",
    });

    const availability = await Availability.find({
      user_id: userId,
    }).select("day from to -_id");

    const response = schedules
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((schedule) => ({
        _id: schedule._id,
        meeting_name: schedule.subject,
        duration: schedule.duration,
        type_of_meeting: schedule.type_of_meeting,
        availability,
        public_link: `book/${schedule.host_id.name}/${schedule.host_id._id}/${schedule._id}`,
      }))
      .filter(
        (b) =>
          (b.type_of_meeting === "one" ||
          b.type_of_meeting === "group")
      );

    res.status(200).json({
      success: true,
      count: response.length,
      data: response,
    });
  } catch (err) {
    err.statusCode = 500;
    err.code = "ERROR_GETTING_SCHEDULES";
    next(err);
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const userId = req.user?.id;

    if (
      !mongoose.Types.ObjectId.isValid(scheduleId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        code: "INVALID_ID",
        message: "Invalid scheduleId or userId",
      });
    }

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      host_id: userId,
      isDeleted: false,
    }).populate({
      path: "host_id",
      select: "name email",
    });

    if (!schedule) {
      return res.status(404).json({
        code: "SCHEDULE_NOT_FOUND",
        message: "Schedule not found",
      });
    }

    const availability = await Availability.find({
      user_id: userId,
    }).select("day from to -_id");

    res.status(200).json({
      success: true,
      data: {
        _id: schedule._id,
        meeting_name: schedule.subject,
        limit : schedule.limit,
        duration: schedule.duration,
        type_of_meeting: schedule.type_of_meeting,
        availability,
        public_link: `book/${schedule.host_id.name}/${schedule._id}`,
      },
    });
  } catch (err) {
    err.statusCode = 500;
    err.code = "ERROR_GETTING_SCHEDULES";
    next(err);
  }
};

const getDetailsofPublicLink = async (req, res, next) => {
  try {
    const { username, userId, schedule_id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(schedule_id)
    ) {
      return res.status(400).json({
        code: "INVALID_ID",
        message: "Invalid user or schedule id",
      });
    }

    const user = await Users.findOne({
      _id: userId,
      name: username,
    }).select("_id name email");

    if (!user) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    const schedule = await Schedule.findOne({
      _id: schedule_id,
      host_id: user._id,
      isDeleted: false,
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

    const bookings = await Bookings.find({
      host_id: user._id,
    }).select("-_id");

    res.status(200).json({
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
          limit : schedule.limit
        },
        availability,
        bookings,
      },
    });
  } catch (err) {
    err.statusCode = 500;
    err.code = "ERROR_GETTING_PUBLICLINK";
    next(err);
  }
};

const createSchedule = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { meeting_name, type_of_meeting, duration  } = req.body;

    if (!userId) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const schedule = await Schedule.create({
      host_id: userId,
      subject: meeting_name,
      duration : duration,
      limit : req.body.limit ,
      type_of_meeting : type_of_meeting,
      isDeleted: false,
    });

    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    err.statusCode = 500;
    err.code = "ERROR_CREATING_SCHEDULES";
    next(err);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { ids } = req.body; 

    if (!userId) {
      return res.status(401).json({ code: "UNAUTHORIZED", message: "User not authenticated" });
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ code: "BAD_REQUEST", message: "No IDs provided" });
    }

    // const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

    await Schedule.updateMany(
      { _id: { $in: ids } },
      { $set: { isDeleted: true } } 
    );

    res.status(200).json({ success: true, message: "Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ code: "ERROR_DELETING_SCHEDULES", message: err.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { scheduleId } = req.params;
    const { duration, limit, subject } = req.body;

    if (!userId) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    if (!scheduleId) {
      return res.status(400).json({
        code: "OTHER",
        message: "ID missing",
      });
    }

    if (!duration && !limit && !subject) {
      return res.status(400).json({
        code: "OTHER",
        message: "Field missing to update",
      });
    }

    const schedule = await Schedule.updateOne(
      { _id: scheduleId },
      {
        $set: {
          duration,
          limit,
          subject
        },
      },
    );

    return res.status(200).json({
      success: true,
      message : "Updated successfully!",
    });
  } catch (err) {
    return res.status(400).json({
      code: "OTHER",
      message: err.message,
    });
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  getDetailsofPublicLink,
  createSchedule,
  deleteSchedule,
  updateSchedule
};
