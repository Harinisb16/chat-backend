import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'ticketing-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

export const sendKafkaMessage = async (topic: string, message: any) => {
  try {
    console.log('Connecting to Kafka producer...');
    await producer.connect();
    console.log('Kafka producer connected.');

    console.log(`Sending message to topic "${topic}"`, message);
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log('Message sent successfully.');
  } catch (error) {
    console.error('Error sending Kafka message:', error);
  } finally {
    console.log('Disconnecting Kafka producer...');
    await producer.disconnect();
    console.log('Kafka producer disconnected.');
  }
};
