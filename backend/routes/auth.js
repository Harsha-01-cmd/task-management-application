require('dotenv').config(); 

const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
   const authorization = req.headers.authorization;
   if (!authorization) {
      return res.status(400).json({ message: "Authorization token missing" });
   }

   const token = authorization.split(" ")[1];
   if (!token) {
      return res.status(400).json({ message: "Token is missing" });
   }

   try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = verified.id; 
      next();
   } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
   }
};


module.exports = { authToken };
