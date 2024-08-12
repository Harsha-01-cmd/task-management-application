const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
router.post("/sign-up", async (req, res) => {
   try {
      const { username, email, password } = req.body;
      
      const existingUsername = await User.findOne({ username });
      const existingUserEmail = await User.findOne({ email });

      if (existingUsername) {
         return res.status(400).json({ message: "Username already exists" });
      } else if (username.length < 8) {
         return res.status(400).json({ message: "Username too short" });
      }

      if (existingUserEmail) {
         return res.status(400).json({ message: "Email already exists" });
      }

      const hashPass = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashPass });
      await newUser.save();

      return res.status(201).json({ message: "User registered successfully" });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
});

// SIGNIN
router.post("/sign-in", async (req, res) => {
   try {
      const { username, password } = req.body;
      
      const existingUser = await User.findOne({ username });
      if (!existingUser) {
         return res.status(400).json({ message: "Invalid username or password" });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
         return res.status(400).json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
         { id: existingUser._id, username: existingUser.username },
         "sattuji05",
         { expiresIn: '6d' }
      );

      return res.status(200).json({ id: existingUser._id, token });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
});

module.exports = router;
