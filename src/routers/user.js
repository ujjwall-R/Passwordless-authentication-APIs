const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();
const otpGenerator = require("otp-generator");
const { sendOTP } = require("../emails/account");

router.get("/", async (req, res) => {
  res.send("auth server live...");
});

//signUp
router.post("/users/signup", async (req, res) => {
  let user = req.body;
  // console.log(user);
  try {
    const otp = await otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    user = { ...user, otp: otp };
    const userInDB = new User(user);
    await userInDB.save();
    await sendOTP(user.email, otp);
    res.status(201).send({ name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//otp verification
router.post("/users/verify", async (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  // console.log(email);
  try {
    const user = await User.findByCredentials(email, otp);
    if (!user) {
      res.send("User not found.");
    }
    const token = await user.generateAuthToken();
    await user.save();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send("Incorrect OTP!");
  }
});

//login
router.post("/users/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (!user) {
      res.send("User not registered!");
    }
    const otp = await otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    user.otp = otp;
    // user = new User(user);
    await user.save();
    await sendOTP(user.email, otp);
    res.send({ user });
  } catch (e) {
    console.log(e);
    res.status(400).send("Error Loging in!");
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
