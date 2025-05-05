const Institute = require("../model/institute");

const addUpdateInstitute = async (req, res) => {
  try {
    const { _id, ...restData } = req.body;

    if (_id) {
      const updateData = {};
      for (const key in restData) {
        if (restData[key] !== undefined) {
          updateData[key] = restData[key];
        }
      }

      const updatedInstitute = await Institute.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedInstitute) {
        return res
          .status(404)
          .json({ success: false, message: "institute not found" });
      }

      console.log("institute updated successfully:", updatedInstitute);
      return res
        .status(200)
        .json({ success: true, message: "institute updated successfully" });
    } else {
      const isInstitutePresent = await Institute.findOne({
        $or: [{ email: restData.email }, { contact: restData.contact }],
      });

      if (isInstitutePresent) {
        return res
          .status(400)
          .json({ success: false, message: "Institute already exists" });
      }

      restData.instituteId = `INS${Date.now()}`;

      // Add new faculty
      const newInstitute = new Institute(restData);
      await newInstitute.save();

      console.log("institute added successfully:", newInstitute);
      return res
        .status(201)
        .json({ success: true, message: "institute added successfully" });
    }
  } catch (error) {
    console.error("Error in addUpdateInstitute:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getInstitute = async (req, res) => {
  try {
    const { data } = req.params;

    const institute = await Institute.findOne({
      $or: [{ email: data }, { contact: data }],
    });
    if (!institute) {
      console.log(`institute not found with ${data}`);
      return res
        .status(404)
        .json({ success: false, message: `institute not found with ${data}` });
    }
    console.log("institute found successfully");
    return res.status(200).json({ success: true, institute: institute });
  } catch (error) {
    console.error("Error in getInstitute:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteInstitute = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Institute.findByIdAndDelete(id);
    if (!deleted) {
      console.log("institute not found");
      return res
        .status(404)
        .json({ success: false, message: "institute not found" });
    }

    console.log("institute deleted successfully");
    return res
      .status(200)
      .json({ success: true, message: "institute deleted successfully" });
  } catch (error) {
    console.error("Error in deleteInstitute:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getInstituteById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)

    const institute = await Institute.findOne({ instituteId: id });
    console.log(institute)
    if (!institute) {
      console.log("institute not found");
      return res
        .status(404)
        .json({ success: false, message: "institute not found" });
    }

    console.log("institute found successfully");
    return res.status(200).json({
      success: true,
      message: "institute found successfully",
      result: institute,
    });
  } catch (error) {
    console.error("Error in deleteInstitute:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addUpdateInstitute,
  getInstitute,
  deleteInstitute,
  getInstituteById,
};
