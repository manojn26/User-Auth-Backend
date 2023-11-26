const express = require("express");
const connectDb = require("./db");
const signinRouter = require("./routes/signin");
const loginRouter = require("./routes/login");
const homeRouter = require("./routes/home");
const cors = require("cors");

const app = express();
const port = 5000;
app.use(express.json());
// csrf avoid
app.use(cors({ origin: "*" }));
connectDb();

// HTTP Methods
/*
GET
POST
PUT
DELETE
*/
app.get("/", (req, res) => {
  res.send("Hello").status(200);
});

app.use("/signin", signinRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);

app.listen(port, () => {
  console.log(`APPLICATION RUNNING AT ${port}`);
});
