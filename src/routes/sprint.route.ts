import { Router } from 'express';
import { sprintController } from '../controllers/sprint.controller';

const router = Router();

router.post('/', sprintController.create);
router.get('/', sprintController.getAll);
router.get('/:id', sprintController.getById);
router.put('/:id', sprintController.update);
router.delete('/:id', sprintController.delete);

export default router;
