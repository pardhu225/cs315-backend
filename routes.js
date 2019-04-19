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

router.post('/api/push-complaint', authMiddlewares.usersOnly, coursesController.complaintPush);

router.post('/api/complaint-complete', authMiddlewares.usersOnly, coursesController.complaintPush);

router.post('/api/hall-dues', authMiddlewares.usersOnly, coursesController.dues);

router.post('/api/personal-details', authMiddlewares.usersOnly, coursesController.personalDetails);

router.post('/api/leave-request', authMiddlewares.usersOnly, coursesController.leaveRequest);

router.post('/api/leave-accepted', authMiddlewares.usersOnly, coursesController.leaveAccepted);

router.post('/api/leave-denied', authMiddlewares.usersOnly, coursesController.leaveDenied);

router.post('/api/course-dropped', authMiddlewares.usersOnly, coursesController.dropCourses);

router.post('/api/course-accepted', authMiddlewares.usersOnly, coursesController.addCourses);

router.post('/api/course-rejected', authMiddlewares.usersOnly, coursesController.rejectedCourses);

module.exports = router;
