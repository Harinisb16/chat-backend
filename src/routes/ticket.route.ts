
import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';

import { upload } from '../middleware/upload';
import { CommentController } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.post('/:ticketId/comments', CommentController.addComment);
router.post('/', upload.single('attachment'), TicketController.create);
router.get('/my-tickets', authenticate, TicketController.getMyTickets);

router.get('/', TicketController.getAll);
router.get('/:id', TicketController.getById);
router.put('/:id', TicketController.update);
router.delete('/:id', TicketController.remove);
router.get('/parentwithchild', TicketController.getAllParentTicketsWithChildren);
router.get('/tickets/:parentId/children', TicketController.getChildTicketsByParentId);

export default router;
