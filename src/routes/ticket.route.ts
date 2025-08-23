import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { upload } from '../middleware/upload';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Create ticket with multiple attachments
router.post('/', upload.array('attachments', 10), TicketController.create);

// Update ticket with multiple attachments
router.put('/:id', upload.array('attachments', 10), TicketController.update);

// Delete ticket
router.delete('/:id', TicketController.remove);

// Get all tickets
router.get('/', TicketController.getAll);

router.get('/parentwithchild/:id', TicketController.getParentwithchildticket);

// router.put('/updateparentwithchild/:id', TicketController.updateParentwithchildticket);

router.put(
  "/updateparentwithchild/:id",
  upload.fields([
    { name: "attachments", maxCount: 5 },
    { name: "childAttachments", maxCount: 10 }
  ]),
  TicketController.updateParentwithchildticket
);

// Get ticket by id
router.get('/:id', TicketController.getById);

// Get tickets owned by logged-in user (requires auth)
router.get('/my-tickets', authenticate, TicketController.getMyTickets);

// Get child tickets by parent ticket id
router.get('/tickets/:parentId/children', TicketController.getChildTicketsByParentId);
router.delete('/:id/attachments/:fileName', TicketController.removeAttachment);

export default router;
