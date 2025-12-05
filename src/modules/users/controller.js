import model from './model.js'
import jwt from '../../utils/jwt.js'
 
const REGISTER = async (req, res) => {
    try {
        const result = await model.REGISTER(req.body);
        
        if (result.success) {
            // ✅ Muvaffaqiyatli ro'yxatdan o'tish
            res.status(200).json({
                status: 200,
                message: result.message,
                data: result.user,
                token: jwt.sign({ userId: result.user.user_id }) // Token qo'shildi
            });
        } else {
            // ❌ Ro'yxatdan o'tishda xatolik
            res.status(400).json({
                status: 400,
                message: result.message,
                data: null,
                token: null
            });
        }
    } catch (error) {
        console.log('controller error:', error.message);
        res.status(500).json({
            status: 500,
            message: "Ichki server xatosi",
            data: null,
            token: null
        });
    }
};

const LOGIN = async (req, res) => {
    try {
        console.log('req.body:', req.body);

        const result = await model.LOGIN(req.body);

        if (result.success) {
            // ✅ Muvaffaqiyatli login
            res.status(200).json({
                status: 200,
                message: result.message,
                data: result.user,
                token: jwt.sign({ userId: result.user.user_id })
            });
        } else {
            // ❌ Muvaffaqiyatsiz login
            res.status(401).json({
                status: 401,
                message: result.message,
                data: null,
                token: null
            });
        }
    } catch (error) {
        console.log('controller error:', error.message);
        res.status(500).json({
            status: 500,
            message: "Ichki server xatosi",
            data: null,
            token: null
        });
    }
};



const UPDATE_BALL = async (req, res) => {
    try {
        const userId = req.userId; // Token'dan keladi
        const { ball } = req.body; // Body'dan ball olinadi

        console.log('Ball yangilash:', { userId, ball });

        const result = await model.UPDATE_BALL(userId, ball);

        if (result.success) {
            // ✅ Muvaffaqiyatli yangilandi
            res.status(200).json({
                status: 200,
                message: result.message,
                data: result.user
            });
        } else {
            // ❌ Xatolik
            res.status(400).json({
                status: 400,
                message: result.message,
                data: null
            });
        }
    } catch (error) {
        console.log('controller error:', error.message);
        res.status(500).json({
            status: 500,
            message: "Ichki server xatosi",
            data: null
        });
    }
};

export default {
    REGISTER,
    LOGIN,
    UPDATE_BALL
}