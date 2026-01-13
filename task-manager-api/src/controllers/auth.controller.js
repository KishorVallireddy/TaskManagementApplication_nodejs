const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/* REGISTER */
exports.register = async (req, res) => {
  let { username, password, confirmPassword } = req.body;
 if (isBase64(password)){
 const decoded = Buffer.from(password, "base64").toString();
   password = decoded.split(":")[0];

    const decodedconfirmPassword = Buffer.from(confirmPassword, "base64").toString();
   confirmPassword = decodedconfirmPassword.split(":")[0];
 }
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
  let { username, password } = req.body;
console.log("password:"+username);
console.log("before password:"+password);
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials 123" });
  }
  if (isBase64(password)){
   const decoded = Buffer.from(password, "base64").toString();
   password = decoded.split(":")[0];
  }
   console.log("password:"+password);
   console.log("user.passwordHash:"+user.passwordHash);
    const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
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
function isBase64(str) {
  try {
    const decoded = Buffer.from(str, "base64").toString("utf-8");
    const reEncoded = Buffer.from(decoded, "utf-8").toString("base64");

    // normalize (remove padding differences)
    return reEncoded.replace(/=+$/, "") === str.replace(/=+$/, "");
  } catch {
    return false;
  }
}
