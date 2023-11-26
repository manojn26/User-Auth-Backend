const express = require("express");
const router = express.Router();
const { AuthorizeUser } = require("../controlers/login");

router.get("/", async (req, res) => {
  const auth_token = req.headers.authorization;
  console.log("Auth Token " + auth_token);
  const loginCredential = await AuthorizeUser(auth_token);
  try {
    if (loginCredential === false) {
      res.status(200).send("Invalid Token");
    } else {
      // res.status(200).send(loginCredential);
      res.json(loginCredential);
      console.log(loginCredential);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Busy");
  }
});

module.exports = router;
