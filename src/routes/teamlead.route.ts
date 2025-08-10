import { Router } from 'express';
import { TeamLeadController} from '../controllers/temalead.controller';

const router = Router();

router.post('/', TeamLeadController.create);
router.get('/', TeamLeadController.getAll);
router.get('/:id', TeamLeadController.getById);
router.put('/:id', TeamLeadController.update);
router.delete('/:id', TeamLeadController.delete);

export default router;
