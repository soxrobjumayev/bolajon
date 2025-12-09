import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data.json');

// JSON fayldan ma'lumot o'qish
async function readData() {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        const newData = { users: [] };
        await fs.writeFile(dataPath, JSON.stringify(newData, null, 2));
        return newData;
    }
}

// JSON faylga ma'lumot yozish
async function writeData(data) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}
const REGISTER = async ({ toliq_ism, telefon_nomer, parol, tugilgan_sana }) => {
    try {
        // Validatsiya
        if (!toliq_ism || !telefon_nomer || !parol || !tugilgan_sana) {
            throw new Error("Barcha maydonlar to'ldirilishi shart!");
        }

        // Sanitize
        const sanitize = (str) => str.trim().replace(/<[^>]*>/g, '');
        toliq_ism = sanitize(toliq_ism);

        // Telefon raqam tekshirish
        if (!/^\+998[0-9]{9}$/.test(telefon_nomer)) {
            throw new Error("Telefon raqami noto'g'ri! (+998XXXXXXXXX)");
        }

        // Parol tekshirish
        const parolRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/;
        if (!parolRegex.test(parol)) {
            throw new Error("Parol kamida 12 belgi, katta-kichik harf, raqam va maxsus belgi bo'lishi kerak!");
        }

        // Sana format tekshirish: YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(tugilgan_sana)) {
            throw new Error("Tug'ilgan sana noto'g'ri formatda! (YYYY-MM-DD)");
        }

        // Haqiqiy sana tekshirish
        const date = new Date(tugilgan_sana);
        if (isNaN(date.getTime())) {
            throw new Error("Tug'ilgan sana mavjud emas!");
        }

        // Fayldan o'qish
        const data = await readData();

        // Raqam mavjudligini tekshirish
        const exists = data.users.find(u => u.telefon_nomer === telefon_nomer);
        if (exists) {
            return {
                success: false,
                message: "Bu telefon raqam allaqachon ro'yxatdan o'tgan!"
            };
        }

        // Yangi foydalanuvchi
        const newUser = {
            user_id: data.users.length + 1,
            toliq_ism,
            telefon_nomer,
            parol_hash: parol,
            tugilgan_sana,     // 🟢 bitta maydon holida saqlaymiz
            ball: 0
        };

        data.users.push(newUser);
        await writeData(data);

        return {
            success: true,
            message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
            user: {
                user_id: newUser.user_id,
                toliq_ism: newUser.toliq_ism,
                telefon_nomer: newUser.telefon_nomer,
                tugilgan_sana,
                ball: newUser.ball
            }
        };

    } catch (error) {
        console.error('Register error:', error.message);
        return { success: false, message: error.message };
    }
};

const LOGIN = async ({ telefon_nomer, parol }) => {
    try {
        console.log('Model ichida:', { telefon_nomer, parol });
        
        // Validatsiya
        if (!telefon_nomer || !parol) {
            throw new Error("Telefon raqam va parol kiritilishi shart!");
        }

        // Telefon format tekshiruvi
        if (!/^\+998[0-9]{9}$/.test(telefon_nomer)) {
            throw new Error("Telefon raqami noto'g'ri! (+998XXXXXXXXX)");
        }

        // Ma'lumotlarni o'qish
        const data = await readData();
        
        // Foydalanuvchini topish
        const user = data.users.find(
            u => u.telefon_nomer === telefon_nomer && u.parol_hash === parol
        );

        // User topilmasa
        if (!user) {
            return {
                success: false,
                message: "Telefon raqam yoki parol noto'g'ri!"
            };
        }

        // Muvaffaqiyatli login
        return {
            success: true,
            message: "Tizimga muvaffaqiyatli kirdingiz!",
            user: {
                user_id: user.user_id,
                toliq_ism: user.toliq_ism,
                telefon_nomer: user.telefon_nomer,
                ball: user.ball
            }
        };

    } catch (error) {
        console.error('Login error:', error.message);
        return {
            success: false,
            message: error.message
        };
    }
};

const UPDATE_BALL = async (userId, newBall) => {
    try {
        // Validatsiya
        if (!userId || newBall === undefined || newBall === null) {
            throw new Error("User ID va ball kiritilishi shart!");
        }

        // Ball raqam ekanligini tekshirish
        if (typeof newBall !== 'number' || newBall < 0) {
            throw new Error("Ball musbat raqam bo'lishi kerak!");
        }

        // Ma'lumotlarni o'qish
        const data = await readData();
        
        // Foydalanuvchini topish
        const userIndex = data.users.findIndex(u => u.user_id === parseInt(userId));

        if (userIndex === -1) {
            return {
                success: false,
                message: "Foydalanuvchi topilmadi!"
            };
        }

        // Ballni qo'shish (avvalgi ball + yangi ball)
        data.users[userIndex].ball = data.users[userIndex].ball + newBall;
        
        // Faylga yozish
        await writeData(data);

        console.log('Ball yangilandi:', data.users[userIndex]);

        return {
            success: true,
            message: "Ball muvaffaqiyatli yangilandi!",
            user: {
                user_id: data.users[userIndex].user_id,
                toliq_ism: data.users[userIndex].toliq_ism,
                telefon_nomer: data.users[userIndex].telefon_nomer,
                ball: data.users[userIndex].ball
            }
        };

    } catch (error) {
        console.error('Update ball error:', error.message);
        return {
            success: false,
            message: error.message
        };
    }
};

export default {
    REGISTER,
    LOGIN,
    UPDATE_BALL
}