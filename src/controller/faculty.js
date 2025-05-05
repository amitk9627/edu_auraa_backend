const Faculty = require("../model/faculty");

const addUpdateFaculty = async (req, res) => {
  try {
    const { _id, ...restData } = req.body;

    if (_id) {
      const updateData = {};
      for (const key in restData) {
        if (restData[key] !== undefined) {
          updateData[key] = restData[key];
        }
      }

      const updatedFaculty = await Faculty.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedFaculty) {
        return res
          .status(404)
          .json({ success: false, message: "Faculty not found" });
      }

      console.log("Faculty updated successfully:", updatedFaculty);
      return res
        .status(200)
        .json({
          success: true,
          message: "Faculty updated successfully",
          data: updatedFaculty,
        });
    } else {
      // Add new faculty
      const newFaculty = new Faculty(restData);
      await newFaculty.save();

      console.log("Faculty added successfully:", newFaculty);
      return res
        .status(201)
        .json({
          success: true,
          message: "Faculty added successfully",
          data: newFaculty,
        });
    }
  } catch (error) {
    console.error("Error in addUpdateFaculty:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getFaculty = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const { id } = req.query;

    if (id) {
      const faculty = await Faculty.findById(id);
      if (!faculty) {
        console.log("Faculty not found");
        return res
          .status(404)
          .json({ success: false, message: "Faculty not found" });
      }
      return res.status(200).json({ success: true, faculty: faculty });
    }

    const facultyList = await Faculty.find({ instituteId: instituteId });
    console.log("Successfully fetched Faculty List");
    return res.status(200).json({ success: true, facultyList: facultyList });
  } catch (error) {
    console.error("Error in getFaculty:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Faculty.findByIdAndDelete(id);
    if (!deleted) {
      console.log("Faculty not found");
      return res
        .status(404)
        .json({ success: false, message: "Faculty not found" });
    }

    console.log("Faculty deleted successfully");
    return res
      .status(200)
      .json({ success: true, message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error in deleteFaculty:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addUpdateFaculty, getFaculty, deleteFaculty };
