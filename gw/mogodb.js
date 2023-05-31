const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(
      process.env.MONGODB_URL ||
        "mongodb://admin:adminpw@localhost:27017?retryWrites=true&w=majority",
      {
        dbName: "gw",
      }
    )
    .catch((e) => {
      console.log(e);
    });
}

module.exports = {
  connectDB,
};
