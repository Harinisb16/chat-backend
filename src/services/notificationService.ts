import { sendKafkaMessage } from "../kafka/producer";


export const notifyReportingManager = async (
  reportingManagerEmail: string,
  ownedBy: string,
  reportingManager: string,
  title: string,
  comments?: string
) => {
  await sendKafkaMessage('ticket-alerts', {
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

export const confirmTicketOwner = async (
  ownerEmail: string,
  ownedBy: string,
  reportingManager: string,
  title: string
) => {
  await sendKafkaMessage('ticket-alerts', {
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
