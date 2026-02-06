const { googleCalenderClient } = require("../config/google.calender.config");
const bookings = require("../models/bookings");
const users = require("../models/users");

const bookingsController = {
  createBooking: async (req, res, next) => {
    try {
      const user = await users.findOne({ _id: req.body.host_id });
      if (!user) {
        const err = new Error("Invalid host.");
        ((err.code = "INVALID_HOST"), (err.statusCode = 404));
        throw err;
      }

      console.log(user);
      const calender = await googleCalenderClient(
        user.access_token,
        user.refresh_token,
        user._id,
      );
      const baseDate = new Date(req.body.date);
      baseDate.setHours(0, 0, 0, 0);
      const from = new Date(baseDate);
      const to = new Date(baseDate);

      from.setMinutes(from.getMinutes() + req.body.from);
      to.setMinutes(to.getMinutes() + req.body.to);

      const response = await calender.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        sendUpdates: "all",
        requestBody: {
          summary: req.body.subject,
          description: "Meeting created by Calendly",
          start: {
            dateTime: from.toISOString(),
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: to.toISOString(),
            timeZone: "Asia/Kolkata",
          },
          attendees: [{ email: req.body.guest.email }],
          conferenceData: {
            createRequest: {
              requestId: "meet-" + Date.now(),
              conferenceSolutionKey: {
                type: "hangoutsMeet",
              },
            },
          },
        },
      });

      const data = {
        duration: req.body.duration,
        type_of_meeting: req.body.type,
        host_id: req.body.host_id,
        subject: req.body.subject,
        schedule_id: req.body.schedule_id,
        meeting_id: response.data.id,
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        guest: [
          {
            name: req.body.guest.name,
            email: req.body.guest.email,
            note: req.body.guest.note ,
          },
        ],
      };

      await bookings.create(data);

      res.status(201).send({
        success: true,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = { bookingsController };
