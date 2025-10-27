import jwt from '../utils/jwt.js'


export default (req,res,next) =>{
    try {
        let {token} = req.headers

        if(!token){
            return next(new Error( 'xato token'))
        }

        let { userId } = jwt.verify(token)
        req.userId = userId

        return next()
    } catch (error) {
        return next(new Error( 'xato token'))
    }
  }