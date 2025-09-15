const { validationResult } = require("express-validator");

const userModel = require("../models/user.model");

const { COOKIES_SECURE, COOKIE_SAMESITE } = process.env;

module.exports.register = async (req, res) => {
  const { username, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const isUserExist = await userModel.findOne({ username: username.toLowerCase() });

  if (isUserExist) {
    return res.status(409).json({ message: "Username not available!" });
  }

  const user = await userModel.create({
    username: username.toLowerCase(),
    password: await userModel.hashPassword(password),
  });

  const tokens = user.signTokens();

  res.status(201).cookie("access", tokens.access, {
    httpOnly: true,
    secure: COOKIES_SECURE == "true",
    sameSite: COOKIE_SAMESITE,
  }).cookie("refresh", tokens.refresh, {
    httpOnly: true,
    secure: COOKIES_SECURE == "true",
    sameSite: COOKIE_SAMESITE,
  }).json({ message: "Created!" });
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await userModel.findOne({ username: username.toLowerCase() }).select("+password");

  const isCredentialsMatch = user && await user.comparePassword(password);

  if (!isCredentialsMatch) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }

  const tokens = user.signTokens();

  user.active = true;
  await user.save();

  res.status(200).cookie("access", tokens.access, {
    httpOnly: true,
    secure: COOKIES_SECURE == "true",
    sameSite: COOKIE_SAMESITE,
  }).cookie("refresh", tokens.refresh, {
    httpOnly: true,
    secure: COOKIES_SECURE == "true",
    sameSite: COOKIE_SAMESITE,
  }).json({ message: "OK!" });
};

module.exports.checkCookies = async (req, res) => {
  res.status(200).json({ cookies: true });
};

module.exports.fetchData = async (req, res) => {
  const id = req.id;

  const { username, todos } = await userModel.findById(id);

  res.status(200).json({ username, todos });
};

module.exports.logout = async (req, res) => {
  const id = req.id;

  const user = await userModel.findById(id);

  user.active = false;
  await user.save();

  res.status(200).clearCookie("access").clearCookie("refresh").json({ message: "OK!" });
};

module.exports.createTodo = async (req, res) => {
  const id = req.id;

  const { task } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await userModel.findById(id);

  user.todos.push({ task });
  await user.save();

  res.status(201).json({ message: "Created!" });
};

module.exports.updateTodo = async (req, res) => {
  const id = req.id;

  const todoId = req.params.id;

  if (!todoId) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const user = await userModel.findById(id);

  const todo = user.todos.id(todoId);

  todo.completed = !todo.completed
  await user.save();

  res.status(200).json({ message: "OK!" });
};

module.exports.deleteTodo = async (req, res) => {
  const id = req.id;

  const todoId = req.params.id;

  if (!todoId) {
    return res.status(400).json({ message: "Bad request!" });
  }

  const user = await userModel.findById(id);

  user.todos.id(todoId).deleteOne();
  await user.save();

  res.status(200).json({ message: "OK!" });
};
