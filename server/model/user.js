import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: "String",
      // required: true,
      // default:
      //   "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestaps: true,
    versionKey: false,
  }
);
userModel.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const hash = bcrypt.hashSync(this.password, 8);
  this.password = hash;
  return next();
});

userModel.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model("user", userModel);
