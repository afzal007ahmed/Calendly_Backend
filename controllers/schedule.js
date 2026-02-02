const { mongoose } = require("mongoose");
const Availability = require("../models/availability");

const Schedule = require('../models/schedule');

const getAllSchedules = async (req, res) => {
  try {

    const {userId} = req.body;

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
    res.status(500).json({
      code: "ERROR GETTING SCHEDULE",
      message: err.message
    });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { userId } = req.body; 

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
    res.status(500).json({
      code: "OTHER",
      message: err.message
    });
  }
};


const getDetailsofPublicLink = async(req, res) => {

}

const createSchedule = async (req, res) => {

}



module.exports = {
    getAllSchedules,
    getScheduleById,
    getDetailsofPublicLink,
    createSchedule
}