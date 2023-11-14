const JWT = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;
const response = require("../../response");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response(400, "error", "access denaid", res);
  }

  try {
    JWT.verify(token, SECRET, (error, decoded) => {
      error && response(400, "Invalid", "Invalid token, please relogin!", res);
      if (!error) {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  auth,
};
