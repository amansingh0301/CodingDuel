const express = require("express");
const path = require("path");
const Socket = require("websocket").server;
const http = require("http");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./user-schema");

const cors = require("cors");
require("dotenv").config();

const dbUri = process.env.MONGO_ATLAS_URI;
const publicPath = path.join(__dirname + "/public");
const port = process.env.PORT || 4000;
var app = express();
app.use(express.static(publicPath));

mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    server.listen(port, () => console.log("Server running on 4000"))
  )
  .catch((err) => console.log(err));

// using middlewares
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.raw());
app.use(express.text());
app.use(cors());

let server = http.createServer(app);

app.get("/check", authenticateToken, (req, res) => {
  res.send(true);
});

app.post("/login", async (req, res) => {
  User.findOne({ username: req.body.username })
    .then(async (user) => {
      console.log("user : ", user);
      if (!user) {
        res.status(400).json({
          msg: "No user found",
          login: false,
        });
      }
      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          const foundUser = { username: user.username };
          const accessToken = jwt.sign(foundUser, process.env.TOKEN_SECRET);
          console.log("accessToken : ", accessToken);
          res.json({
            accessToken: accessToken,
            login: true,
          });
        } else {
          res.status(400).json({
            msg: "wrong password",
            login: false,
          });
        }
      } catch {
        res.status(500).json({
          msg: "err",
          login: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).send("err");
    });
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    user
      .save()
      .then(() => {
        console.log("user saved : ", user);
        res.json({
          Registered: user,
        });
      })
      .catch((err) =>
        res.json({
          Registered: err,
        })
      );
  } catch {
    console.log("err");
    res.send("Error");
  }
});

function authenticateToken(req, res, next) {
  console.log("authenticating");
  const authHeader = req.headers["authorization"];
  console.log("authHeader : ", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.send(false);
  }
  console.log("verifying token : ", token);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("token does not match");
      return res.send(false);
    }
    req.user = user;
    console.log("autheticated");
    next();
  });
}

const webSocket = new Socket({ httpServer: server });
let users = [];

webSocket.on("request", (req) => {
  const connection = req.accept();

  connection.on("message", (message) => {
    const data = JSON.parse(message.utf8Data);

    const user = findUser(data.username);

    switch (data.type) {
      case "store_user":
        if (user != null) {
          return;
        }

        const newUser = {
          conn: connection,
          username: data.username,
        };

        users.push(newUser);
        console.log(newUser.username);
        break;
      case "store_offer":
        if (user == null) return;
        user.offer = data.offer;
        break;

      case "store_candidate":
        if (user == null) {
          return;
        }
        if (user.candidates == null) user.candidates = [];

        user.candidates.push(data.candidate);
        break;
      case "send_answer":
        if (user == null) {
          return;
        }

        sendData(
          {
            type: "answer",
            answer: data.answer,
          },
          user.conn
        );
        break;
      case "send_candidate":
        if (user == null) {
          return;
        }

        sendData(
          {
            from: "receiver",
            type: "candidate",
            candidate: data.candidate,
          },
          user.conn
        );
        break;
      case "join_call":
        if (user == null) {
          return;
        }

        sendData(
          {
            type: "offer",
            offer: user.offer,
          },
          connection
        );

        user.candidates.forEach((candidate) => {
          sendData(
            {
              from: "sender",
              type: "candidate",
              candidate: candidate,
            },
            connection
          );
        });

        break;
    }
  });

  connection.on("close", (reason, description) => {
    users.forEach((user) => {
      if (user.conn == connection) {
        users.splice(users.indexOf(user), 1);
        return;
      }
    });
  });
});

function sendData(data, conn) {
  conn.send(JSON.stringify(data));
}

function findUser(username) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) return users[i];
  }
}
