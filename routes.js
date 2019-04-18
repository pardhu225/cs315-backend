const express = require("express");
const router = express.Router();

const userController = require('./controllers/user-controller');
const coursesController = require('./controllers/courses-controller');

let authMiddlewares = require("./middlewares/auth");

router.post('/api/user/register/student', userController.registerStudent);
router.post('/api/user/register/faculty', userController.registerFaculty);

router.post('/api/user/me', authMiddlewares.usersOnly, userController.getUserDetails);

router.put('/api/student/update', authMiddlewares.usersOnly, authMiddlewares.studentOnly, userController.updateStudent);
// router.put('/api/faculty/update', authMiddlewares.usersOnly, authMiddlewares.facultyOnly, userController.updateFaculty);

router.get('/api/student/courses-this-sem', authMiddlewares.usersOnly, authMiddlewares.studentOnly, coursesController.thisSemCourses);

router.post('/api/all-courses', authMiddlewares.usersOnly, coursesController.getCourses);

module.exports = router;
