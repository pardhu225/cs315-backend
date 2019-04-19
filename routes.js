const express = require("express");
const router = express.Router();

const userController = require('./controllers/user-controller');
const coursesController = require('./controllers/courses-controller');
const adminController = require('./controllers/admin-controller');

let authMiddlewares = require("./middlewares/auth");

router.post('/api/user/register/student', userController.registerStudent);
router.post('/api/user/register/faculty', userController.registerFaculty);

router.post('/api/user/me', authMiddlewares.usersOnly, userController.getUserDetails);

router.put('/api/student/update', authMiddlewares.usersOnly, authMiddlewares.studentOnly, userController.updateStudent);
// router.put('/api/faculty/update', authMiddlewares.usersOnly, authMiddlewares.facultyOnly, userController.updateFaculty);

router.get('/api/student/courses-this-sem', authMiddlewares.usersOnly, authMiddlewares.studentOnly, coursesController.thisSemCourses);
router.post('/api/student/request-course', authMiddlewares.usersOnly, authMiddlewares.studentOnly, coursesController.requestCourse);

router.get('/api/faculty/courses-this-sem', authMiddlewares.usersOnly, authMiddlewares.facultyOnly, coursesController.thisSemCourses);

router.post('/api/all-courses', authMiddlewares.usersOnly, coursesController.getCourses);
router.get('/api/student/all-courses-this-sem', authMiddlewares.usersOnly, coursesController.thisSemAllCourses);

router.post('/api/faculty/create-offering', authMiddlewares.usersOnly, authMiddlewares.facultyOnly, coursesController.createOffering);
router.post('/api/faculty/register-as-tutor', authMiddlewares.usersOnly, authMiddlewares.facultyOnly, coursesController.registerAsTutor);

router.post('/api/push-complaint', authMiddlewares.usersOnly, adminController.complaintPush);

router.post('/api/complaint-complete', authMiddlewares.usersOnly, adminController.complaintPush);

router.post('/api/hall-dues', authMiddlewares.usersOnly, adminController.dues);

router.post('/api/personal-details', authMiddlewares.usersOnly, userController.personalDetails);

router.post('/api/leave-request', authMiddlewares.usersOnly, adminController.leaveRequest);

router.post('/api/leave-accepted', authMiddlewares.usersOnly, adminController.leaveAccepted);

router.post('/api/leave-denied', authMiddlewares.usersOnly, adminController.leaveDenied);

router.post('/api/course-dropped', authMiddlewares.usersOnly, coursesController.dropCourses);

router.post('/api/course-accepted', authMiddlewares.usersOnly, coursesController.addCourses);

router.post('/api/course-rejected', authMiddlewares.usersOnly, coursesController.rejectedCourses);

module.exports = router;
