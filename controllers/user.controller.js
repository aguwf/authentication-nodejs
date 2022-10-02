const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const userService = require("../services/user.service");
const { APIError } = require("../utils/APIError");

const register = catchAsync(async (req, res) => {
  try {
    const user = await userService.register(req.body);

    // Check errors
    if (user.errorCode) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: user.msg, errorCode: user.errorCode, path: req.path });
    }

    delete user.password;

    res.status(httpStatus.CREATED).json(user);
  } catch (error) {
    throw new APIError(error.message, httpStatus.BAD_REQUEST);
  }
});

const login = catchAsync(async (req, res) => {
  try {
    const user = await userService.login(req.body.username, req.body.password);

    // Check errors
    if (user.errorCode) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: user.msg, errorCode: user.errorCode, path: req.path });
    }

    delete user.password;

    res.status(httpStatus.OK).json(user);
  } catch (error) {
    throw new APIError(error.message, httpStatus.BAD_REQUEST);
  }
});

const forgotPassword = catchAsync(async (req, res) => {
  try {
    await userService.forgotPassword(req.body.email);
    res.status(httpStatus.OK).json({ msg: "Email sent" });
  } catch (error) {
    throw new APIError(error.message, httpStatus.BAD_REQUEST);
  }
});

const changePassword = catchAsync(async (req, res) => {
  try {
    const user = await userService.changePassword(
      req.body.username,
      req.body.oldPassword,
      req.body.newPassword,
      req.body.confirm
    );

    // Check errors
    if (user.errorCode) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: user.msg, errorCode: user.errorCode, path: req.path });
    }

    delete user.password;

    res.status(httpStatus.OK).json(user);
  } catch (error) {
    throw new APIError(error.message, httpStatus.BAD_REQUEST);
  }
});

module.exports = {
  register,
  login,
  forgotPassword,
  changePassword,
};
