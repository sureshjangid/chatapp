const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    pic: {
      type: String,
      default:
        "https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-user-avatar-login-interface-abstract-purple-user-icon-png-image_3917506.jpg",
    },
  },
  { timestamps: true }
);

userModel.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};
userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userModel);

module.exports = User;
