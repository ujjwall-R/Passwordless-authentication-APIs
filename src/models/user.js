const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  gender: {
    type: String,
    required: false,
    default: "choose not to say",
  },
  otp: {
    type: String,
    required: false,
    default: "****",
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.otp;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewcourse", {
    expiresIn: "2h",
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(otp, user.otp);

  if (!isMatch) {
    throw new Error("Incorrect OTP");
  }

  return user;
};

// Hash the plain text otp before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("otp")) {
    user.otp = await bcrypt.hash(user.otp, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
