// src/routes/childticket.routes.ts
import express from 'express';
import * as controller from '../controllers/childticket.controller';
import { upload } from '../middleware/upload';

const router = express.Router();

// router.post(
//   '/childtickets/:parentId',
//   upload.single('attachment'),
//   controller.createChildTicket
// );

router.post('/childtickets/:parentId', upload.array('attachments', 10), controller.createChildTicket);
// router.post('/childtickets/:parentId', controller.createChildTicket);


router.get('/childtickets', controller.getAllChildTickets);
router.get('/childtickets/:id', controller.getChildTicketById);
router.put('/childtickets/:id',upload.array('attachments', 10), controller.updateChildTicket);
router.delete('/childtickets/:id', controller.deleteChildTicket);
router.delete(
  '/childtickets/:id/attachments/:fileName',
  controller.removeAttachment
);
export default router;
