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

router.get('/api/faculty/courses-this-sem', authMiddlewares.usersOnly, authMiddlewares.facultyOnly, coursesController.thisSemFacCourses);

router.post('/api/all-courses', authMiddlewares.usersOnly, coursesController.getCourses);
router.get('/api/student/all-courses-this-sem', authMiddlewares.usersOnly, coursesController.thisSemAllCourses);
router.post('/api/faculty/students-of', authMiddlewares.usersOnly, authMiddlewares.facultyOnly, coursesController.studentsOfCourse);

router.post('/api/faculty/create-offering', authMiddlewares.usersOnly, authMiddlewares.facultyOnly, coursesController.createOffering);
router.post('/api/faculty/register-as-tutor', authMiddlewares.usersOnly, authMiddlewares.facultyOnly, coursesController.registerAsTutor);

router.post('/api/push-complaint', authMiddlewares.usersOnly, adminController.complaintPush);
router.post('/api/complaint-history', authMiddlewares.usersOnly, adminController.complaintHistory);
router.post('/api/complaint-complete', authMiddlewares.usersOnly, adminController.complaintCompleted);

router.post('/api/student/course-dropped', authMiddlewares.usersOnly, coursesController.dropCourse);
router.post('/api/faculty/drop-accept', authMiddlewares.usersOnly, coursesController.acceptDropCourse);
router.post('/api/faculty/drop-reject', authMiddlewares.usersOnly, coursesController.rejectDropCourse);
router.post('/api/faculty/course-accepted', authMiddlewares.usersOnly, coursesController.acceptCourses);
router.post('/api/faculty/course-rejected', authMiddlewares.usersOnly, coursesController.rejectedCourses);
router.post('/api/student/request-withdraw', authMiddlewares.usersOnly, coursesController.withdrawCourse);
router.post('/api/faculty/course-ask-to-meet', authMiddlewares.usersOnly, coursesController.letsMeetCourse);
router.post('/api/faculty/current-students', authMiddlewares.usersOnly, coursesController.currentStudents);

router.post('/api/hall-dues', authMiddlewares.usersOnly, adminController.dues);

router.post('/api/personal-details', authMiddlewares.usersOnly, userController.personalDetails);

router.post('/api/leave-request', authMiddlewares.usersOnly, adminController.leaveRequest);

router.post('/api/leave-accepted', authMiddlewares.usersOnly, adminController.leaveAccepted);

router.post('/api/leave-denied', authMiddlewares.usersOnly, adminController.leaveDenied);


module.exports = router;
