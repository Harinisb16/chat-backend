import { Router } from 'express';
import UserRoleController from '../controllers/userrole.controller';

const router = Router();

router.post('/', UserRoleController.create);
router.get('/', UserRoleController.getAll);
router.get('/:id', UserRoleController.getById);
router.put('/:id', UserRoleController.update);
router.delete('/:id', UserRoleController.delete);

export default router;
