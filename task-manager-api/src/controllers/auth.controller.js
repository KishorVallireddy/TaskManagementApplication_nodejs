const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/* REGISTER */
exports.register = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // 1. Validate input
  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 2. Password match check
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // 3. Check existing user
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // 4. Hash password
  const passwordHash = bcrypt.hashSync(password, 10);

  // 5. Save user
  const user = await User.create({
    username,
    passwordHash
  });

  res.status(201).json({
    message: "User registered successfully",
    userId: user._id
  });
};

/* LOGIN (already present) */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ Include role in JWT
  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // ✅ Include username + role in response
  res.json({
    access_token: token,
      username: user.username,
      role: user.role
  });
};

