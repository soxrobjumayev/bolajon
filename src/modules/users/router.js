import { Router } from "express";
import controller from './controller.js'
import token from '../../middlewares/checktoken.js'


const router = Router()

router.post('/register',controller.REGISTER)
router.post('/login',controller.LOGIN)

// router.get('/users/:user_id',token,controller.GET_ID)









export default router