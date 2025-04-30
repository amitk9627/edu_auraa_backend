const express = require('express');
const router = express.Router();

const { addUpdateCourse, getCourse, deleteCourse } = require('../controller/courses');

router.post('/addUpdateCourse', addUpdateCourse);
router.get('/getCourse/:instituteId', getCourse);             
router.delete('/deleteCourse/:id', deleteCourse);  

module.exports = router;
