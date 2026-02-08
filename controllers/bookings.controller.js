const { googleCalenderClient } = require("../config/google.calender.config");
const bookings = require("../models/bookings");
const meetings = require("../models/meetings");
const users = require("../models/users");

const bookingsController = {
  createBooking: async (req, res, next) => {
    try {
      const user = await users.findOne({ _id: req.body.host_id });
      console.log(user);
      if (!user) {
        const err = new Error("Invalid host.");
        (err.code = "INVALID_HOST"), (err.statusCode = 404);
        throw err;
      }

      const calender = await googleCalenderClient(
        user.access_token,
        user.refresh_token,
        user._id
      );

      const { schedule_id, from, to } = req.body;

      const existingBooking = await bookings.findOne({
        schedule_id: schedule_id,
        from: from,
        to: to,
      });

      if (existingBooking) {
        const event = await calender.events.get({
          calendarId: "primary",
          eventId: existingBooking.meeting_id,
        });
        let attendees = [];
        const alreadyIn = event.data.attendees?.reduce((first, second) => {
          if (second.email === req.body.guest.email || first) {
            return true;
          }
          return false;
        }, false);

        if (alreadyIn) {
          const err = new Error(
            "You are already in this meeting. Please select a different time slot and date."
          );
          err.code = "GUEST_EXISTS";
          err.statusCode = 403;
          throw err;
        }
        if (
          (req.body.type === "one" ||
            req.body.limit <= existingBooking.guest.length) &&
          existingBooking
        ) {
          const err = new Error("Limit reached for guests.");
          err.code = "MEETING_LIMIT_REACHED";
          err.statusCode = 400;
          throw err;
        }

        if (event.data.attendees) {
          attendees = [...event.data.attendees];
        }
        attendees = [...attendees, { email: req.body.guest.email }];
        await calender.events.patch({
          calendarId: "primary",
          eventId: existingBooking.meeting_id,
          sendUpdates: "all",
          requestBody: {
            attendees: attendees,
          },
        });

        await bookings.updateOne(
          {
            meeting_id: existingBooking.meeting_id,
          },
          {
            $push: {
              guest: {
                name: req.body.guest.name,
                email: req.body.guest.email,
                note: req.body.guest.note,
              },
            },
          }
        );
        return res.status(201).send({
          success: true,
          error: null,
        });
      }

      const baseDate = new Date(req.body.date);
      const fromTime = new Date(baseDate);
      const toTime = new Date(baseDate);

      fromTime.setMinutes(fromTime.getMinutes() + req.body.from);
      toTime.setMinutes(toTime.getMinutes() + req.body.to);

      const response = await calender.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        sendUpdates: "all",
        requestBody: {
          summary: req.body.subject,
          description: "Meeting created by Calendly",
          start: {
            dateTime: fromTime.toISOString(),
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: toTime.toISOString(),
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
            note: req.body.guest.note,
          },
        ],
      };

      const booking = await bookings.create(data);
      await meetings.create({
        booking_id: booking._id,
        meeting_id: response.data.id,
        status: true,
      });

      res.status(201).send({
        success: true,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteBooking: async (req, res, next) => {
    try {
      const { meeting_id } = req.params;

      const userId = req.user?.id;

      if (!meeting_id) {
        return res.status(400).json({
          success: false,
          message: "Meeting ID is required",
        });
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const meeting = await meetings.findById(meeting_id);

      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found",
        });
      }

      await meetings.findByIdAndUpdate(meeting_id, {
        status: false,
      });

      const user = await users.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.access_token || !user.refresh_token) {
        return res.status(403).json({
          success: false,
          message: "Google Calendar not connected",
        });
      }

      // ✅ Init calendar
      const calendar = await googleCalenderClient(
        user.access_token,
        user.refresh_token,
        userId
      );

      try {
        await calendar.events.delete({
          calendarId: "primary",
          eventId: meeting_id,
          sendUpdates: "all",
        });
      } catch (err) {
        console.error("Google Calendar delete failed:", err.message);
      }

      return res.status(200).json({
        success: true,
        message: "Meeting cancelled",
      });
    } catch (error) {
      console.error("Delete booking error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to cancel meeting",
      });
    }
  },
};

module.exports = { bookingsController };
