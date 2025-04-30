const checkRequiredField = async (reqBody, requiredFields) => {
    try {
      // Find the first missing field
      const firstMissingField = requiredFields.find(
        (field) => reqBody[field] == undefined || reqBody[field] == null || reqBody[field] == ""
      );
  
      // Return result
      return {
        isValid: firstMissingField === undefined, // true if no missing field
        missingField: firstMissingField || null, // name of the first missing field, or null if all are present
      };
    } catch (err) {
      // Handle errors and return default response
      console.error("Error checking required fields:", err);
      return {
        isValid: false,
        missingField: null,
      };
    }
  };

module.exports ={checkRequiredField}  