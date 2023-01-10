const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const app = express();
const Port = 3000;
require("dotenv").config();

// Connecting The Database
connectDB();

// middlewares
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// app.use(
//   session({
//     secret: "my secret key",
//     saveUninitialized: true,
//     resave: false,
//   })
// );

// app.use((req, res, next) => {
//   res.locals.message = req.session.message;
//   delete req.session.message;
//   next();
// });

// app.use(express.static("uploads"));

// set template engine
// app.set("view engine", "ejs");

// route prefix
// app.use("/", require("./routes/routes"));

app.get("/", (req, res) => {
  res.send("Hello..Just to check");
});

app.listen(Port, () => {
  console.log(`SERVER RUNNING ON PORT-->${Port}`);
});
