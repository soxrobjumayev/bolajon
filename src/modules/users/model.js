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
        // Agar fayl bo'lmasa, yangi yaratamiz
        const newData = { users: [] };
        await fs.writeFile(dataPath, JSON.stringify(newData, null, 2));
        return newData;
    }
}

// JSON faylga ma'lumot yozish
async function writeData(data) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

const REGISTER = async ({
    ism,
    familya,
    tugilgan_sana,
    yashash_joy,
    maktab,
    sinf,
    telefon_nomer,
    parol
}) => {
    try {
        // Validatsiya
        if (!ism || !familya || !tugilgan_sana || !yashash_joy ||
            !maktab || !sinf || !telefon_nomer || !parol) {
            throw new Error("Barcha maydonlar to'ldirilishi shart!");
        }

        const sanitize = (str) => str.trim().replace(/<[^>]*>/g, '');
        ism = sanitize(ism);
        familya = sanitize(familya);
        yashash_joy = sanitize(yashash_joy);
        maktab = sanitize(maktab);
        sinf = sanitize(sinf);

        // Telefon tekshirish
        if (!/^\+998[0-9]{9}$/.test(telefon_nomer)) {
            throw new Error("Telefon raqami noto'g'ri! (+998XXXXXXXXX)");
        }

        // Parol tekshirish
        const parolRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/;
        if (!parolRegex.test(parol)) {
            throw new Error("Parol kamida 12 belgi, katta-kichik harf, raqam va maxsus belgi (@$!%*?&#) bo'lishi kerak!");
        }

        // Ma'lumotlarni o'qish
        const data = await readData();
        
        // Telefon raqam bormi tekshirish
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
            ism,
            familya,
            tugilgan_sana,
            yashash_joy,
            maktab,
            sinf,
            telefon_nomer,
            parol_hash: parol // Test uchun oddiy parol (keyinchalik bcrypt ishlatish mumkin)
        };

        data.users.push(newUser);
        await writeData(data);

        console.log('JSON ga qo\'shildi:', newUser);

        return {
            success: true,
            message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
            user: {
                user_id: newUser.user_id,
                ism: newUser.ism,
                familya: newUser.familya,
                telefon_nomer: newUser.telefon_nomer
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
                ism: user.ism,
                familya: user.familya,
                telefon_nomer: user.telefon_nomer
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

export default {
    REGISTER,
    LOGIN
}