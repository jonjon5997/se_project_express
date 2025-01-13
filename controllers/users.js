const User = require("../models/user");

//GET users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      throw Error("AHH!!");
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers };
