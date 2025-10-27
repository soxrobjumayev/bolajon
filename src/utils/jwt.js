import  jwt  from "jsonwebtoken";

 
export default {
    sign: (payload) => jwt.sign(payload,'nok'),
    verify: (token) => jwt.verify(token,'nok'),

}

