"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmTicketOwner = exports.notifyReportingManager = void 0;
const producer_1 = require("../kafka/producer");
const notifyReportingManager = async (reportingManagerEmail, ownedBy, reportingManager, title, comments) => {
    await (0, producer_1.sendKafkaMessage)('ticket-alerts', {
        type: 'TICKET_CREATED',
        to: reportingManagerEmail,
        subject: `New Ticket Created: ${title}`,
        body: `Dear ${reportingManager},

A new support ticket has been created by **${ownedBy}** with the following title:  
**"${title}"**

${comments || 'No comments were provided.'}

Please review the ticket at your earliest convenience.

Regards,  
Ticketing System`,
    });
};
exports.notifyReportingManager = notifyReportingManager;
const confirmTicketOwner = async (ownerEmail, ownedBy, reportingManager, title) => {
    await (0, producer_1.sendKafkaMessage)('ticket-alerts', {
        type: 'TICKET_CONFIRMATION',
        to: ownerEmail,
        subject: `Ticket Submitted: ${title}`,
        body: `Dear ${ownedBy},

Your ticket has been successfully submitted.

Ticket Title: **"${title}"**  
Reporting Manager: **${reportingManager}**

Please wait for your manager to review and take necessary actions.

Regards,  
Ticketing System`,
    });
};
exports.confirmTicketOwner = confirmTicketOwner;
