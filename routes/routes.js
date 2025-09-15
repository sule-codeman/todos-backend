const express = require("express");
const router = express.Router();

const { body } = require("express-validator");

const controllers = require("../controllers/controllers");

const middlewares = require("../middlewares/middlewares");

router.post("/register", [
  body("username")
    .notEmpty()
    .withMessage("Required")
    .isLength({ min: 4, max: 20 })
    .withMessage("4 - 20 characters long")
    .matches(/^[A-Za-z0-9].*/)
    .withMessage("Start with a letter or number")
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage("Only letters, numbers, and . _ -"),
  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("6 - 20 characters long")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/)
    .withMessage("At least include letters and numbers")
    .matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)
    .withMessage("Unsupported characters"),
], controllers.register);

router.post("/login", [
  body("username").notEmpty().withMessage("Required"),
  body("password").notEmpty().withMessage("Required"),
], controllers.login);

router.get("/check-cookies", middlewares.authenticate, controllers.checkCookies);

router.get("/fetch-data", middlewares.authenticate, controllers.fetchData);

router.get("/logout", middlewares.authenticate, controllers.logout);

router.post("/create-todo", middlewares.authenticate, [
  body("task").notEmpty().withMessage("Required"),
], controllers.createTodo);

router.patch("/update-todo/:id", middlewares.authenticate, controllers.updateTodo);

router.delete("/delete-todo/:id", middlewares.authenticate, controllers.deleteTodo);

module.exports = router;
