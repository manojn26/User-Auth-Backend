const express = require("express");
const { AuthenticateUser } = require("../controlers/login");
const router = express.Router();
const client = require("../redis");

client
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((e) => {
    console.log(e);
  });

router.post("/", async (req, res) => {
  const { email, password } = await req.body;
  //console.log(email, password);
  const loginCredentials = await AuthenticateUser(email, password);
  //console.log(loginCredentials);
  if (loginCredentials === "Invalid User name or Password") {
    res.status(200).send("Invalid User name or Password");
  } else if (loginCredentials === "Server Busy") {
    res.status(200).send("Server Busy");
  } else {
    res.status(200).json({ token: loginCredentials.token });
  }
});

module.exports = router;
