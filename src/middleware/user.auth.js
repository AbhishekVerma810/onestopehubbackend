const helper = require("../utils/helper")
const { User } = require("../models")
const jwt = require("jsonwebtoken")
const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/constants")
const { successResponseData, errorResponseWithoutData ,successResponseWithoutData} = require('../utils/response');



// module.exports = async (req, res, next) => {
//     let token = req.headers.authorization.split(' ')[1];
//     console.log('mytoken=>',token)
//     if (!token) {
//         return response.errorResponseWithoutData(res, ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODES.ACCESS_DENIED);
//     } else {
//         try {
//             // const decodedToken = jwt.verify(token, process.env.SECRET)
//             // let user = await User.findOne({ where: { token: token } })
//             // console.log('user131',user)
//             user = await User.findOne({
//                 where: { token :  token },
//                 attributes: ["id", "email", "password","token","fcm_token"],
//               });
//               req = user.dataValues
//               console.log('helloabhi',req)
//               next();
//             return next()
//         } catch (err) {
//             return response.errorResponseWithoutData(res, ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODES.ACCESS_DENIED);
//         }
//     }
// }


module.exports = async (req, res, next) => {
    try {
      let token = req.headers.authorization;
      if (!token) {
        return errorResponseWithoutData(
          res,
          "Unauthorized access"
        );
      }
      token = token.split(" ")[1]; 
      await jwt.verify(token, process.env.SECRET, async function (err, decoded) {
        if (err) {
          return res.status(401).json({ error: "Unauthorized access" });
        } else {
          req.user = await User.findOne({
            where: { token: token },
            attributes: ["id", "email", "password","token"],
          });
          next();
        }
      });
    } catch (error) {
      console.log("errorinmiddleware", error);
    }
  };