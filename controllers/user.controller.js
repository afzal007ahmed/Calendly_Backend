const User = require("../models/users");

/*
  GET /users/me
  Returns user id and username
 */
exports.getUserIdAndName = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("_id name email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

/*
  PATCH /users/name
  Updates only username
 */
exports.updateUserName = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    ).select("_id name");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Name updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
      },
    });
  } catch (err) {
    next(err);
  }
};
