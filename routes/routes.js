// For writing all the routes of the particular application
const express = require("express");
const router = express.Router();
const Holder = require("../models/holders");
const multer = require("multer");
const fs = require("fs");
const holders = require("../models/holders");
const { findById } = require("../models/holders");
const { parse } = require("path");

// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

// Insert an account into database
router.post("/add", upload, (req, res) => {
  const holder = new Holder({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    amount: req.body.amount,
    image: req.file.filename,
  });
  // console.log(holder.email);
  holder.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "Account has been created!!",
      };
      res.redirect("/holders");
    }
  });
});

// Get all accounts to the Holders page
router.get("/holders", (req, res) => {
  Holder.find().exec((err, holders) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      // console.log(holders);
      res.render("Holders", {
        title: "Holders",
        holders: holders,
      });
    }
  });
});

// Update the Holder Info Page
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  Holder.findById(id, (err, holder) => {
    if (err) {
      res.redirect("/holders");
    } else {
      if (holder == null) {
        res.redirect("/holders");
      } else {
        res.render("edit_account", {
          title: "Edit Account",
          holder: holder,
        });
      }
    }
  });
});

// Update Holder Info route
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  Holder.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      amount: req.body.amount,
      image: new_image,
    },
    (err, result) => {
      if (err) res.json({ message: err.message, type: danger });
      else {
        req.session.message = {
          type: "success",
          message: "Holder Info Updated Succesfully",
        };
        res.redirect("/holders");
      }
    }
  );
});

// Delete Account
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  Holder.findByIdAndRemove(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.unlinkSync("./uploads/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: "success",
        message: "Account Deleted Successfully",
      };
      res.redirect("/holders");
    }
  });
});

// Get all the holders inside transactions page
router.get("/transactions", (req, res) => {
  Holder.find().exec((err, holders) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      // console.log(holders);
      res.render("Transactions", {
        title: "Transactions",
        holders: holders,
      });
    }
  });
});

router.post("/send", (req, res) => {
  var senderid = req.body.sender;
  var receiverid = req.body.receiver;
  var sendamount = req.body.amount;
  if (senderid === receiverid) {
    req.session.message = {
      message: "The transaction cannot be done between the same account",
      type: "danger",
    };
    res.redirect("/transactions");
  }
  Holder.findById(senderid, (err, docs) => {
    if (err) {
      req.session.message = {
        message: "Sorry an error occured",
        type: "danger",
      };
      res.redirect("/transactions");
    } else if (parseInt(docs.amount) <= parseInt(sendamount)) {
      req.session.message = {
        message: "The sender does not have this much of amount",
        type: "danger",
      };
      res.redirect("/transactions");
    } else {
      docs.amount -= sendamount;
      docs.save();
      Holder.findById(receiverid, (err, documents) => {
        if (err) {
          req.session.message = {
            message: "Sorry an error occured",
            type: "danger",
          };
          res.redirect("/transactions");
        } else {
          var add = parseInt(documents.amount) + parseInt(sendamount);
          documents.amount = add;
          documents.save();
          req.session.message = {
            message: "Transaction has been completed.",
            type: "success",
          };
          res.redirect("/holders");
        }
      });
    }
  });
});

router.get("/holders", (req, res) => {
  res.render("Holders", {
    title: "Holders",
  });
});
router.get("/transactions", (req, res) => {
  res.render("Transactions", {
    title: "Transaction",
  });
});
router.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
  });
});

router.get("/add", (req, res) => {
  res.render("add_account", {
    title: "Add Account",
  });
});

// login page
// router.get("/", (req, res) => {
//   res.render("login", { title: "Login Please" });
// });

// using login page
/* const creds = {
  username: "anant_singh",
  password: "123",
}; */
// router.post("/", (req, res) => {
//   var username = req.body.username;
//   var password = req.body.password;
//   if (username == creds.username && password == creds.password) {
//     req.session.user = req.body.username;
//     res.render("/home");
//   } else {
//     req.session.message = {
//       type: "danger",
//       message: "Invalid email and password",
//     };
//     console.log(username);
//     res.redirect("/");
//   }
// });
module.exports = router;
