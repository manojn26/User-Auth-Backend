const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const client = require("../redis");
dotenv.config();

async function CheckUser(email) {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    return "Server Busy";
  }
}

async function AuthenticateUser(email, password) {
  try {
    const userCheck = await User.findOne({ email: email });

    console.log(userCheck);
    const validatePassword = await bcrypt.compare(password, userCheck.password);
    console.log(validatePassword);
    if (validatePassword) {
      const token = jwt.sign({ email }, process.env.LOGIN_SECRET_TOKEN);
      const response = {
        id: userCheck._id,
        name: userCheck.name,
        email: userCheck.email,
        token: token,
        status: true,
      };
      await client.set(`key : ${email}`, JSON.stringify(response));
      await User.findOneAndUpdate(
        { email: userCheck.email },
        { $set: { token: token } },
        { new: true }
      );
      return response;
    }
    return "Invalid User name or Password";
  } catch (error) {
    console.log(error);
    return "Server Busy";
  }
}

async function AuthorizeUser(token) {
  try {
    const decodedToken = jwt.verify(token, process.env.LOGIN_SECRET_TOKEN);
    console.log("Token " + decodedToken);
    if (decodedToken) {
      const email = decodedToken.email;
      const auth = await client.get(`key-${email}`);
      if (auth) {
        const data = JSON.parse(auth);
        return data;
      } else {
        data = await User.findOne({ email: email });
        return data;
      }
    }
    return false;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { CheckUser, AuthenticateUser, AuthorizeUser };
