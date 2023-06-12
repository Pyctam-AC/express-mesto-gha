const User = require('../models/user')

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      return res.status(500).send({ message: "Server Error" });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Такой пользователь не найден" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      return res.status(400).send(err.message);
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((newUser) => {
      return res.status(200).send(newUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(", ")}`,
        });
      }
      return res.status(500).send({ message: "Server Error" });
    });
}

const updateDataUser = (req, res) => {
  const newUserData = req.body;
  return User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
  })
  .then((user) => {
    if (!user) {
      return res
        .status(404)
        .send({ message: "Такой пользователь не найден" });
    }
    return res.status(201).send(user);
  })
  .catch((err) => {
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: `${Object.values(err.errors)
          .map((err) => err.message)
          .join(", ")}`,
      });
    }
    return res.status(500).send({ message: "Server Error" });
  });
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
  .then((user) => {
    if (!user) {
      return res
        .status(404)
        .send({ message: "Такой пользователь не найден" });
    }
    return res.status(201).send(user);
  })
  .catch((err) => {
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: `${Object.values(err.errors)
          .map((err) => err.message)
          .join(", ")}`,
      });
    }
    return res.status(500).send({ message: "Server Error" });
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateDataUser,
  updateAvatarUser
};





