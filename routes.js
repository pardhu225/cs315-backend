const express = require("express");
const router = express.Router();

const userController = require('./controllers/user-controller');

let authMiddlewares = require("./middlewares/auth");

router.post('/api/user/register/student', userController.registerStudent);

router.post('/api/user/student/me', authMiddlewares.usersOnly, userController.getStudentDetails);

module.exports = router;
