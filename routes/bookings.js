const { bookingsController } = require("../controllers/bookings.controller");

const bookingRouter = require("express").Router() ;

bookingRouter.post("/" , bookingsController.createBooking )

module.exports = { bookingRouter } 