
import model from './model.js'
import jwt from '../../utils/jwt.js'
 
 const REGISTER =async (req,res) =>{
    try {
        const user = await model.REGISTER(req.body)
        if(user){
            res.status(200).json({
                status:200,
                message:'ok',
                data: user,
            })

        }else{
            res.status(403).json({
                status:403,
                message:'xato admin',
                data: user,
            })
        }
    } catch (error) {
        console.log('contrr',error.message);
    }
 }

// Controller funksiyasi
const LOGIN = async (req, res) => {
    try {
        console.log('req.body:', req.body);

        // Modeldan qaytgan natijani "result" deb nomlaymiz
        const result = await model.LOGIN(req.body);

        // Natijaning "success" maydonini tekshiramiz
        if (result.success) {
            // ✅ Muvaffaqiyatli login
            res.status(200).json({
                status: 200,
                message: 'ok',
                data: result, // Barcha ma'lumotni (user, message) qaytaramiz
                token: jwt.sign({ userId: result.user.user_id }) // Tokenni to'g'ri ID bilan imzolaymiz
            });
        } else {
            // ❌ Muvaffaqiyatsiz login (parol xato, validatsiya xatosi)
            // 403 (Forbidden) o'rniga 401 (Unauthorized) ishlatgan ma'qulroq
            res.status(401).json({
                status: 401,
                message: result.message, // Xato xabarini modeldan olamiz
                data: null, // Muvaffaqiyatsiz bo'lsa data bo'sh
                token: null  // Token berilmaydi
            });
        }
    } catch (error) {
        console.log('contrr', error.message);
        // Kutilmagan server xatosi
        res.status(500).json({
            status: 500,
            message: "Ichki server xatosi",
            data: null,
            token: null
        });
    }
};


export default {
 REGISTER,LOGIN
}


