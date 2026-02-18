// import { Router } from 'express';
// import { register, login, getAll } from '../controllers/auth.controller';
// import { upload } from '../middleware/upload';

// const router = Router();

// router.post("/register", upload.single("photo"), register); 
// router.post('/login', login);
// router.get("/", getAll); 
// export default router;


import { Router } from 'express';
import { register, login, getAll } from '../controllers/auth.controller';
import { upload } from '../middleware/upload';
import { authenticate } from '../middleware/auth.middleware';
import { logoutUser } from "../controllers/user.controller";

const router = Router();

router.post("/register", upload.single("photo"), register);
router.post('/login', login);
router.get("/", authenticate, getAll);
router.post('/logout', authenticate, logoutUser);

export default router;
