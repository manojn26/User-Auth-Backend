const redis = require("redis");
const dotenv = require("dotenv");
dotenv.config();

const redisClient = () => {
  return redis.createClient({
    url: process.env.REDIS_URL,
  });
};

const client = redisClient();

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (error) => {
  console.log(error);
});

client.on("end", () => {
  console.log("Connection Ended");
});

client.on("SIGQUIT", () => {
  client.quit();
  console.log("Connection Quitted");
});

module.exports = client;
