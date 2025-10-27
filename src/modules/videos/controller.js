import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GET_VIDEO = async (req, res) => {
    try {
        // Query orqali video ID yoki nomi
        const { id } = req.query; // /video/download?id=3

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Video ID ko‘rsatilmagan!',
                data: null
            });
        }

        // Fayl yo‘lini yaratish
        const videoPath = path.resolve('videos', `${id}.mp4`);

        // Fayl mavjudligini tekshirish
        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({
                status: 404,
                message: `Video ${id}.mp4 topilmadi!`,
                data: null
            });
        }

        // Video yuklab olish
        res.download(videoPath, `${id}.mp4`, (err) => {
            if (err) {
                console.error('Video yuklashda xato:', err);
                return res.status(500).json({
                    status: 500,
                    message: 'Video yuklashda xatolik yuz berdi',
                    data: null
                });
            }
        });

    } catch (error) {
        console.log('Video controller xato:', error.message);
        res.status(500).json({
            status: 500,
            message: 'Server xatosi',
            data: null
        });
    }
};

export default {
    GET_VIDEO
};
