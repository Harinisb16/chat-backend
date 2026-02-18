"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_controller_1 = require("../controllers/ticket.controller");
const upload_1 = require("../middleware/upload");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Create ticket with multiple attachments
router.post('/', upload_1.upload.array('attachments', 10), ticket_controller_1.TicketController.create);
// Update ticket with multiple attachments
router.put('/:id', upload_1.upload.array('attachments', 10), ticket_controller_1.TicketController.update);
// Delete ticket
router.delete('/:id', ticket_controller_1.TicketController.remove);
// Get all tickets
router.get('/', ticket_controller_1.TicketController.getAll);
router.get('/tic', ticket_controller_1.TicketController.getTicketsGroupedBySprint);
router.get('/parentwithchild/:id', ticket_controller_1.TicketController.getParentwithchildticket);
// router.put('/updateparentwithchild/:id', TicketController.updateParentwithchildticket);
router.put("/updateparentwithchild/:id", upload_1.upload.fields([
    { name: "attachments", maxCount: 5 },
    { name: "childAttachments", maxCount: 10 }
]), ticket_controller_1.TicketController.updateParentwithchildticket);
// Get ticket by id
router.get('/:id', ticket_controller_1.TicketController.getById);
// Get tickets owned by logged-in user (requires auth)
router.get('/my-tickets', auth_middleware_1.authenticate, ticket_controller_1.TicketController.getMyTickets);
// Get child tickets by parent ticket id
router.get('/tickets/:parentId/children', ticket_controller_1.TicketController.getChildTicketsByParentId);
router.delete('/:id/attachments/:fileName', ticket_controller_1.TicketController.removeAttachment);
exports.default = router;
