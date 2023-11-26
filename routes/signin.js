const express = require("express");
const { CheckUser } = require("../controlers/login");
const router = express.Router();
const {
  InsertVerifyUser,
  InsertSignUpUser,
  CheckVerify,
} = require("../controlers/signin");

router.get("/:token", async (req, res) => {
  try {
    const response = await InsertSignUpUser(req.params.token);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(`
    <html>
      <body>
        <h1>Registration Failed</h1>
        <h1>Link Expired...</h1>
        <p> Regards </p>
        <p> Team </p>
      </body>
    </html>
  `);
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { name, email, password } = await req.body;
    console.log(name, email, password);
    const registerCredentials = await CheckUser(email);
    const verifyCredentials = await CheckVerify(email);

    console.log(verifyCredentials, registerCredentials);
    if (registerCredentials === true || verifyCredentials === true) {
      res.status(200).send(false);
    } else if (registerCredentials === false || verifyCredentials === false) {
      InsertVerifyUser(name, email, password);
      res.status(200).send(true);
    } else if (registerCredentials === "Server Busy") {
      res.status(500).send("Server Busy");
    }
    // const registerCredentials = await CheckUser(email);
    // const verifyCredentials = await CheckVerify(email);
    // if (registerCredentials === true || verifyCredentials === true) {
    //   res.status(200).send(false);
    // } else if (registerCredentials === false || verifyCredentials === false) {
    //   InsertVerifyUser(name, email, password);
    //   res.status(200).send(true);
    // } else if (registerCredentials === "Server Busy") {
    //   res.status(500).send("Server Busy");
    // }
  } catch (error) {}
});

module.exports = router;
