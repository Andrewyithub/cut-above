const authRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const foundUser = await User.findOne({ email }); // removed .exec();
  const match = await bcrypt.compare(password, foundUser.passwordHash);
  if (!match) return res.status(401).json({ message: "Unauthorized" });
  const accessToken = jwt.sign(
    {
      id: foundUser._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );
  const newRefreshToken = jwt.sign(
    {
      id: foundUser._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "5m" }
  );
  // Creates Secure Cookie with refresh token
  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 5 * 60 * 1000, // 5 minutes
  });
  res.status(200).json({
    success: true,
    message: "Successfully logged in",
    user: foundUser.email,
    accessToken,
  });
});

module.exports = authRouter;
