"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startKafkaConsumer = void 0;
const kafkajs_1 = require("kafkajs");
const emailService_1 = require("../utils/emailService");
const kafka = new kafkajs_1.Kafka({
    clientId: 'ticketing-app-consumer',
    brokers: ['localhost:9092'],
});
const consumer = kafka.consumer({ groupId: 'email-group' });
const startKafkaConsumer = async () => {
    try {
        console.log('Connecting Kafka consumer...');
        await consumer.connect();
        console.log('Kafka consumer connected.');
        await consumer.subscribe({ topic: 'ticket-alerts', fromBeginning: false });
        console.log('Subscribed to topic: ticket-alerts');
        await consumer.run({
            eachMessage: async ({ message }) => {
                console.log('Received message:', message.value?.toString());
                try {
                    const { to, subject, body } = JSON.parse(message.value.toString());
                    console.log(`Sending email to ${to}`);
                    await (0, emailService_1.sendEmail)(to, subject, body);
                    console.log('Email sent successfully.');
                }
                catch (emailErr) {
                    console.error('Error processing message or sending email:', emailErr);
                }
            },
        });
    }
    catch (err) {
        console.error('Kafka consumer error:', err);
    }
};
exports.startKafkaConsumer = startKafkaConsumer;
