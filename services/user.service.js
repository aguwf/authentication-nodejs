"use strict";

const httpStatus = require("http-status");
const User = require("../models/user.model");
const { APIError } = require("../utils/APIError");
const nodemailer = require("nodemailer");
const config = require("../config/config");

/**
 * Register new user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const register = async (payload) => {
  const { username, password, confirm, email, phone, address } = payload;

  // Check password
  if (password !== confirm) {
    return {
      msg: "Password does not match",
      errorCode: httpStatus.BAD_REQUEST,
    };
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return {
      msg: "Password must contain at least 8 characters, at least one uppercase letter, one lowercase letter and one number",
      errorCode: httpStatus.BAD_REQUEST,
    };
  }

  // Check email
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return {
      msg: "Email is not valid",
      errorCode: httpStatus.BAD_REQUEST,
    };
  }

  // Check if user already exist
  const existedUser = await User.findOne({
    username,
    email,
  });

  if (existedUser) {
    return { msg: "User already exist", errorCode: httpStatus.BAD_REQUEST };
  }

  // Hash password
  const hashedPassword = await User.hashPassword(password);

  const newUser = new User(payload);

  newUser.password = hashedPassword;

  return newUser.save();
};

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const login = async (username, password) => {
  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    throw new APIError("User does not exist", httpStatus.NOT_FOUND);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new APIError("Password is not correct", httpStatus.BAD_REQUEST);
  }

  return user;
};

/**
 * Forgot password
 * @param {string} email
 * @returns {Promise<User>}
 */
const forgotPassword = async (email) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: {
        user: config.smtp.email,
        pass: config.smtp.password,
      },
    });

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return { msg: "User does not exist", errorCode: httpStatus.BAD_REQUEST };
    }

    // Generate random password
    const randomPassword = Math.random().toString(36).slice(-8);

    // Hash password
    const hashedPassword = await User.hashPassword(randomPassword);

    user.password = hashedPassword;

    await user.save();

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"An toan ung dung web"`, // sender address
      to: email, // list of receivers
      subject: "Reset password", // Subject line
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nHere is your new password: ${randomPassword}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`, // plain text body
    });

    console.log("Message sent: %s", info);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    return info;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Change password
 * @param {string} email
 * @returns {Promise<User>}
 */
const changePassword = async (username, oldPassword, newPassword, confirm) => {
  // Check password
  if (newPassword !== confirm) {
    return {
      msg: "Password does not match",
      errorCode: httpStatus.BAD_REQUEST,
    };
  }

  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    return { msg: "User does not exist", errorCode: httpStatus.BAD_REQUEST };
  }

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    return {
      msg: "Password is not correct",
      errorCode: httpStatus.BAD_REQUEST,
    };
  }

  const hashedPassword = await User.hashPassword(newPassword);

  user.password = hashedPassword;

  return user.save();
};

module.exports = {
  register,
  login,
  forgotPassword,
  changePassword,
};
