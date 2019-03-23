const express = require("express");
const router = express.Router();

let tokenMiddleware = require("../middlewares/any-user-auth");

router.get('', queryController.get_content);

router.post('/hospitality', tokenMiddleware, contentControl('POST', 'hospitality'));

module.exports = router;
