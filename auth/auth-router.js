const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./auth-model.js");
const secrets = require("./secret.js");

router.get("/", (req, res) => {
  Users.getUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching users from database" });
    });
});

router.post("/register", (req, res) => {
  // implement registration
  const user = req.body;
  const hash = bcrypt.hashSync(user.password);
  user.password = hash;

  Users.add(user)
    .then(added => {
      res.status(201).json(added);
    })
    .catch(err => {
      res.status(500).json({ message: "Error adding user to database" });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.find({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = getJwt(user);
        res.status(200).json({
          message: `${user.username} is logged in!`,
          token
        });
      } else {
        res.status(401).json({ message: "Wrong username or password" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error accessing database" });
    });
});

function getJwt(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    jwtid: 1
  };
  const options = {
    expiresIn: "2 days"
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
