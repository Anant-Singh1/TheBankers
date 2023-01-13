const express = require("express");
const session = require("express-session");
var bodyParser = require("body-parser");

const connectDB = require("./config/db");
const app = express();
const Port = 3000;
require("dotenv").config();

// Connecting The Database
connectDB();

//Adding the middlewares to the server
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// parse application/json
// app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// app.use(bodyParser.json()); // to support JSON-encoded bodies
// app.use(
//   bodyParser.urlencoded({
//     // to support URL-encoded bodies
//     extended: true,
//   })
// );
// Initialising the express-session
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use("/css", express.static("css"));
app.use("/images", express.static("images"));

// Storing the session message
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("uploads"));

// Setting up the Template Engine
app.set("view engine", "ejs");

// route prefix
app.use("/", require("./routes/routes"));

// app.get("/", (req, res) => {
//   res.send("Hello..Just to check");
// });

app.listen(Port, () => {
  console.log(`SERVER RUNNING ON PORT-->${Port}`);
});
