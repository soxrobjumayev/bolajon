import { Router } from "express";
import controller from './controller.js';

const router = Router();

// Video yuklab olish uchun GET so'rov
// Misol: /video/download?id=5
router.get('/video/download', controller.GET_VIDEO);

export default router;
