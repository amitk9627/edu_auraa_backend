const institute = require('../model/institute');
const UserModel = require('../model/user');
const { checkRequiredField } = require('../utils/checkRequiredField');
const mailSender = require('../utils/mailSender');


function otpGenerator() {
    return Math.floor(Math.random() * 900000) + 100000;
  }

const createUser = async (req, res) => {
  
    let data = req.body;
    try {
       
      const requiredFields = ["email", "firstName", "contact", "userType"];
      const { isValid, missingField } = await checkRequiredField(data, requiredFields);
  
      if (!isValid) {
        console.log(
          `- app/v1/user/createUser -- Missing field: ${missingField}`
        );
    
        return res.status(400).json({
          userCreated: false,
          message: `Missing field: ${missingField}`,
        });
      }
      
        console.log("userType", data.userType)  
  
        let user = await UserModel.exists({$or: [{contact: data.contact}, {email: data.email}]});
        console.log("user", user);
    
        if (user) {
          console.log(" - app/v1/user/createUser - user exist");
          await UserModel
            .findOne({ _id: user._id })
            .then((response) => {
              console.log(
                " - app/v1/user/createUser - user found"
              );
              return res.status(200).json({
                userCreated: false,
                userExist: true,
                userID: response.userID,
                userType: response.userType,
                user_obj_id: response._id,
                name: response.firstName,
                number: response.contact,
                email: response.email,
              });
            })
            .catch((err) => {
              console.log(
                " - /app/v1/user/createUser - Api failure",
                err
              );
                  
              return res.status(500).json({
                userCreated: false,
                userExist: false,
                result: err.message,
              });
            });
        } else {
          console.log(
            " - /app/v1/user/createUser - user not exist creating..."
          );

          let instituteId = data.userType === "INSTITUTE" ? `INS${Date.now()}` : "";
          let userID = `USIN${Date.now()}`;
          let query = {
            userID: userID,
            instituteId: instituteId,
            firstName: data.firstName,
            gender: data?.gender,
            contact: data.contact,
            address: data?.address,
            city: data?.city,
            postalCode: data?.postalCode,
            email: data.email.toLowerCase(),
            password: data?.password,
            userType: data.userType,
            otp: {
              code: null,
              otpExpiry: null,
            },
          };

          if(data.userType === "INSTITUTE"){
            const instituteQuery = {
              email: data.email,
              contact: data.contact,
              instituteId: instituteId,
              instituteName: data.firstName
            }
            const newInstitute = new institute(instituteQuery);
            await newInstitute.save();
          }
    
          await UserModel
            .create(query)
            .then((response) => {
              console.log(
                " - app/v1/user/createUser - user created successfully"
              );
              res.status(200).json({
                userCreated: true,
                userExist: false,
                userID: userID,
                user_obj_id: response._id,
                result: "user created succesfully",
                role: response.userType,
                name: response.firstName,
                number: response.contact,
                email: response.email,
                gender: response.gender,
                instituteId: response.instituteId
              });
            })
            .catch((err) => {
              console.log(
                " - app/v1/user/createUser - unable to create user",
                err
              );
    
              res.status(500).json({
                userCreated: false,
                userExist: false,
                result: err.message,
              });
            });
        }
  
    } catch (error) {
      console.log(
        " - /app/v1/user/createUser - unable to create user API Failure",
        error
      );
      
      return res.status(500).json({
        userCreated: false,
        userExist: false,
        result: error.message
      });
    }
  };

  
const loginViaEmail = async (req, res) => {
    try {
       
      let data = req.body;
      if(!data.email){
        console.log(
          " - /app/v1/user/otp/loginViaEmail - Missing required email ",
        );
        return res.status(400).json({
          userLogin: false,
          result: "Missing required email!",
        });
      }
  
      const query = {
        email: data.email.toLowerCase(),
      };
  
      let findCred = await UserModel.findOne(query);
  
      if (findCred) {
        let otp = otpGenerator();
        const expiry = new Date(Date.now() + 5 * 60 * 1000);
        
        let docToUpdate = {
          otp: {
            code: otp,
            otpExpiry: expiry,
          },
        };
        
  
        await UserModel
          .findOneAndUpdate(query, docToUpdate)
          .then(() => {
            console.log(
              " - /app/v1/user/loginViaEmail - user exists and otp updated",
              data.email
            );
            res.status(200).json({ userAssociated: true, otpUpdated: true });
          })
          .catch((err) => {
            console.log(
              " - /app/v1/user/loginViaEmail - user exists and unable to update otp",
              data.email
            );
            return res.status(200).json({ userAssociated: true, otpUpdated: false });
          });
  
        let subject = "Team Eduauraa - One Time Password";
        let html = `
            <!DOCTYPE html>
            <html>
            <body>
            <p>Hi ${data.email},</p>
            <br>
            <p>There was a request for OTP</p>
            <p>If you did not make the request, then please ignore the email.</p>
            <p>Otherwise, please use the One Time Password (OTP) below, It will expire in 5 mins.</p>
            <br>
            <p style="text-align:center;font-weight: 800; font-size: 24px;">${otp}</p>
            <br>
            <p>Yours,</p>
            <p>Team Eduauraa</p>
            </body>
            </html>
            `;
  
        await mailSender(data.email.toLowerCase(), subject, html, "otp")
          .then(() => {
            console.log("otp sent");
          })
          .catch((err) => {
            console.log("unable to send otp", err);
          });
      } else {
        console.log(
          " - /app/v1/user/loginViaEmail - user not found",
          data.email
        );
        return res.status(404).json({ userAssociated: false, otpUpdated: false, result: "User not found" });
      }
    } catch (err) {
      return res.status(500).json({ userAssociated: false, otpUpdated: false });
    }
  };

  
const verifyOtpViaEmail = async (req, res) => {
    try {
      let data = req.body;
  
      if(!data.email){
        console.log(
          " - app/v1/user/otp/verifyOtpViaEmail - Missing required email",
        );
        return res.status(400).json({
          auth: false,
          description: "Missing required email!",
        });
      }
  
      const query = {
        email : data.email.toLowerCase()
      };
  
      let findCred = await UserModel.findOne(query);
  
    //   const accessToken = await generateAccessToken(data.emailID, findCred.firstName, findCred.userType);
    //   const refreshToken = await generateRefreshToken(data.emailID, findCred.firstName, findCred.userType);
  
      if (findCred) {
        let currentTime = new Date(Date.now());
  
        if (currentTime > findCred.otp.otpExpiry) {
          console.log(
            " - /app/v1/user/verifyOtpViaEmail - OTP Expired ",
            data.email
          );
          res.status(401).json({
            auth: false,
            description: "OTP expired, request a new otp",
          });
        } else if (Number(data.otp) !== findCred.otp.code) {
          console.log(
            " - /app/v1/user/verifyOtpViaEmail - Incorrect OTP ",
            data.email
          );
          res.status(401).json({
            auth: false,
            description: "Incorrect OTP",
          });
        } else if (findCred.otp.code === null) {
          console.log(
            " - /app/v1/user/verifyOtpViaEmail - Incorrect OTP ",
            data.email
          );
          res.status(401).json({
            auth: false,
            description: "Incorrect OTP",
          });
        } else {
          // setting again null so that otp can be used once
          let docToUpdate = {
            otp: { code: null, otpExpiry: null },
          };
  
          await UserModel
            .findOneAndUpdate(query, docToUpdate)
            .then((response) => {
              console.log(
                " - /app/v1/user/verifyOtpViaEmail - Success ",
                data.email
              );  
              res.status(200).json({
                // accessToken: accessToken,
                // refreshToken: refreshToken,
                auth: true,
                description: "Login Success",
                response: response
              });
            })
            .catch((err) => {
              console.log(
                " - /app/v1/user/verifyOtpViaEmail - Error ",
                data.email,
                err
              );
              res.status(500).json({
                auth: false,
                description: "Try Again",
              });
            });
        }
      } else {
        console.log(
          " - /app/v1/user/verifyOtpViaEmail - Error User doesn't exist",
          data.email,
        );
        res.status(404).json({
          auth: false,
          description: "User doesn't exist",
        });
      }
    } catch (err) {
      console.log(
        " - /app/v1/user/verifyOtpViaEmail - Error ",
        data.email,
        err
      );
      res.status(500).json({
        auth: false,
        description: "Try Again",
      });
    }
  };

  module.exports = {
    createUser,
    loginViaEmail,
    verifyOtpViaEmail
  };