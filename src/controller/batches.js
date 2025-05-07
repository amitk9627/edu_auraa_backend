const Batches = require('../model/batches');
const { checkRequiredField } = require('../utils/checkRequiredField');

const addUpdateBatch = async (req, res) => {
  try {
    
    const data = req.body;
    const requiredFields = [
      "instituteId",
      "batchName",
      "startDate",
      "endDate", 
      "mode", 
      "daysOfClasses",
      "timeSlot",
    ];

    const { isValid, missingField } = await checkRequiredField(
      data,
      requiredFields
    );
    if (!isValid) {
      console.log(`addUpdateBatch -- Missing field: ${missingField}`);

      return res.status(400).json({
        success: false,
        message: `Missing field: ${missingField}`,
      });
    }

    const { _id, ...restData } = req.body;

    if (_id) {
       const updateData = {};
       for (const key in restData) {
         if (restData[key] !== undefined) {
           updateData[key] = restData[key];
         }
       }

       const updatedBatch = await Batches.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedBatch) {
        return res.status(404).json({success:false,  message: 'batch not found' });
      }

      console.log('batch updated successfully:', updatedBatch);
      return res.status(200).json({ success:true, message: 'batch updated successfully' });
    } else {

      // Add new faculty
      const newBatch = new Batches(restData);
      await newBatch.save();

      console.log('batch added successfully:', newBatch);
      return res.status(201).json({ success:true, message: 'batch added successfully' });
    }
  } catch (error) {
    console.error('Error in addUpdateBatch:', error);
    return res.status(500).json({ success:false, message: error.message });
  }
};

const getBatch = async (req, res) => {
    try {
    const { instituteId } = req.params;
    const { id } = req.query;

    if (id) {
        const batch = await Batches.findById(id);
        if (!batch) {
        console.log('Batches not found');
        return res.status(404).json({ success:false, message: 'Batches not found' });
        }
        console.log('Successfully fetched batch');
        return res.status(200).json({success:true, batch:batch});
    }

    const BatchList = await Batches.find({instituteId: instituteId});
    console.log('Successfully fetched Batches List');
    return res.status(200).json({success:true, BatchList: BatchList});
  
    } catch (error) {
      console.error('Error in getBatch:', error);
      return res.status(500).json({ success:false, error: error.message });
    }
  };

const deleteBatch = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await Batches.findByIdAndDelete(id);
      if (!deleted) {
        console.log('batch not found');
        return res.status(404).json({ success:false, message: 'batch not found' });
      }
  
      console.log('batch deleted successfully');
      return res.status(200).json({ success:true, message: 'batch deleted successfully' });
    } catch (error) {
      console.error('Error in deleteBatch:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
module.exports = { addUpdateBatch, getBatch, deleteBatch };
