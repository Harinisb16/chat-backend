import { Router } from 'express';
import { register, login, getAll } from '../controllers/auth.controller';
import { upload } from '../middleware/upload';

const router = Router();

router.post("/register", upload.single("photo"), register); 
router.post('/login', login);
router.get("/", getAll); 
export default router;
