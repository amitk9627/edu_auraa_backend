const Course = require('../model/courses');
const { checkRequiredField } = require('../utils/checkRequiredField');

const addUpdateCourse = async (req, res) => {
  try {
    const { _id, ...restData } = req.body;

    if (_id) {
       const updateData = {};
       for (const key in restData) {
         if (restData[key] !== undefined) {
           updateData[key] = restData[key];
         }
       }

       const updatedCourse = await Course.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedCourse) {
        return res.status(404).json({success:false,  message: 'course not found' });
      }

      console.log('course updated successfully:', updatedCourse);
      return res.status(200).json({ success:true, message: 'course updated successfully' });
    } else {
    const data = req.body;
    const requiredFields = [
        "instituteId",
        "courseName",
        "examType",
        "mode",
        "duration",
        ];
        const { isValid, missingField } = await checkRequiredField(data, requiredFields);
    
        if (!isValid) {
        console.log(`addUpdateCourse -- Missing field: ${missingField}`);
    
        return res.status(400).json({
            success: false,
            message: `Missing field: ${missingField}`,
        });
        }

      // Add new faculty
      const newCourse = new Course(restData);
      await newCourse.save();

      console.log('course added successfully:', newCourse);
      return res.status(201).json({ success:true, message: 'course added successfully' });
    }
  } catch (error) {
    console.error('Error in addUpdateCourse:', error);
    return res.status(500).json({ success:false, message: error.message });
  }
};

const getCourse = async (req, res) => {
    try {
    const { instituteId } = req.params;
    const { id } = req.query;

    if (id) {
        const course = await Course.findById(id);
        if (!course) {
        console.log('Course not found');
        return res.status(404).json({ success:false, message: 'Course not found' });
        }
        console.log('Successfully fetched course');
        return res.status(200).json({success:true, course:course});
    }

    const CourseList = await Course.find({instituteId: instituteId});
    console.log('Successfully fetched Course List');
    return res.status(200).json({success:true, CourseList: CourseList});
  
    } catch (error) {
      console.error('Error in getCourse:', error);
      return res.status(500).json({ success:false, error: error.message });
    }
  };

const deleteCourse = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await Course.findByIdAndDelete(id);
      if (!deleted) {
        console.log('course not found');
        return res.status(404).json({ success:false, message: 'course not found' });
      }
  
      console.log('course deleted successfully');
      return res.status(200).json({ success:true, message: 'course deleted successfully' });
    } catch (error) {
      console.error('Error in deleteCourse:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
module.exports = { addUpdateCourse, getCourse, deleteCourse };
