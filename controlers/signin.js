const User = require("../models/user");
const { sendMail } = require("./sendMail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
dotenv.config();

async function InsertVerifyUser(name, email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);

    const newUser = verifyUser({
      name: name,
      email: email,
      password: hashedPassword,
      token: token,
    });

    const activationLink = `https://auth-backend-jin9.onrender.com/signin/${token}`;
    const content = `<h1>Hello, Welcome</h1>
                    <h1> Welcome to our Application</h1>
                    <p> Thanks for signing up, Click on the link to get activate</p>
                    <a href=${activationLink}>Click here </a>
                    <p> Regards </p>
                    <p> Team </p>
    `;

    await newUser.save();
    console.log(newUser);
    sendMail(email, "Verify User", content);
  } catch (err) {
    console.log(err);
  }
}

function generateToken(email) {
  const token = jwt.sign(email, process.env.SECRETKEY);
  return token;
}

async function InsertSignUpUser(token) {
  try {
    const userVerify = await verifyUser.findOne({ token: token });

    if (userVerify) {
      const newUser = new User({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        forgetPassword: {},
      });

      await newUser.save();
      await verifyUser.deleteOne({ token: token });
      const content = `<h1>Hello, Welcome</h1>
    <h1> Welcome to our Application</h1>
    <p> You are succcessfully registered</p>
    <p> Regards </p>
    <p> Team </p>
    `;
      sendMail(newUser.email, "Registration Succesfull", content);
      return `<h1>Registration Succesfull</h1>
    <h1> Welcome to our Application</h1>
    <p> You are succcessfully registered</p>
    <p> Regards </p>
    <p> Team </p>
    `;
    }
    return `<h1>Registration Failed</h1>
  <h1> Link Expired</h1>
  <p> Regards </p>
  <p> Team </p>
`;
  } catch (error) {
    console.log(error);
    return `
    <html>
      <body>
        <h1>Registration Failed</h1>
        <h1> Unexpected Error Occured</h1>
        <p> Regards </p>
        <p> Team </p>
      </body>
    </html>
  `;
  }
}

async function CheckVerify(email) {
  try {
    const user = await verifyUser.findOne({ email: email });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    return "Server Busy";
  }
}

module.exports = { InsertVerifyUser, InsertSignUpUser, CheckVerify };
