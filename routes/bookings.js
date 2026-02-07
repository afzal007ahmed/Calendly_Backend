const { bookingsController } = require("../controllers/bookings.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const bookingRouter = require("express").Router() ;

bookingRouter.post("/" , bookingsController.createBooking )
bookingRouter.delete("/:meeting_id" , authMiddleware , bookingsController.deleteBooking)

module.exports = { bookingRouter } 