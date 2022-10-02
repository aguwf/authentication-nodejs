const md5 = require("md5");
const { Schema, default: mongoose } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      required: true,
    },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

UserSchema.statics.hashPassword = async function (password) {
  return md5(password);
};

UserSchema.methods.comparePassword = async function (password) {
  return this.password === md5(password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
