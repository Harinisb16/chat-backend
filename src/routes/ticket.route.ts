
import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';

import { upload } from '../middleware/upload';

const router = Router();

router.post('/', upload.single('attachment'), TicketController.create);
router.get('/', TicketController.getAll);
router.get('/:id', TicketController.getById);
router.put('/:id', TicketController.update);
router.delete('/:id', TicketController.remove);

router.get('/tickets/:parentId/children', TicketController.getChildTicketsByParentId);

export default router;
