const { Schedules } = '../models/schedule.model.js'

const getAllSchedules = async(req, res) => {
    try {
        const schedules = await Schedules.aggregate([
            {
                $match : {
                    host_id : req.user?._id
                }
            },
            {
                $lookup : {
                    from : "users",
                    localField : "host_id",
                    foreignField : "_id",
                    as : "host"
                }
            }, { $unwind : "$host" },
            {
                $lookup : {
                    from : "availabilities",
                    localField : "host_id",
                    foreignField : "user_id",
                    as : "availability"
                }
            },
            {
                $project : {
                    _id : 
                }
            }
        ]);


        res.status(200).json({
            succes : true,
            count : schedules.length,
            data : schedules
        })

    } catch (err) {
        res.status(401).send({
        code: err.code || "OTHER",
        message: err.message,
    });
    }
}

const getScheduleById = async(req, res) => {

}

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