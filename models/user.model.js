const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SALT_ROUNDS, JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRY, JWT_REFRESH_TOKEN_EXPIRY } = process.env;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  todos: [
    {
      task: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  }
});

userSchema.statics.hashPassword = function (password) {
  const rounds = Number(SALT_ROUNDS);
  return bcrypt.hash(password, rounds);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.signTokens = function () {
  const access = jwt.sign({ id: this._id, type: "ACCESS" }, JWT_SECRET, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRY,
  });

  const refresh = jwt.sign({ id: this._id, type: "REFRESH" }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRY,
  });

  return { access, refresh };
};

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
