// src/routes/childticket.routes.ts
import express from 'express';
import * as controller from '../controllers/childticket.controller';

const router = express.Router();

router.post('/childtickets/:parentId', controller.createChildTicket);
router.get('/childtickets', controller.getAllChildTickets);
router.get('/childtickets/:id', controller.getChildTicketById);
router.put('/childtickets/:id', controller.updateChildTicket);
router.delete('/childtickets/:id', controller.deleteChildTicket);

export default router;
