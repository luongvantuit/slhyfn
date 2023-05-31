const express = require("express");

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});
const { route } = require("./app_routes");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");


app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1", route);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`Launcher Okie ${process.env.PORT || 3000}`);
});
