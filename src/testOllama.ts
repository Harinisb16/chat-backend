import { askOllama, processPrompt } from "./services/ollamaService";
import { sequelize } from "./config/db";

async function testPrompt() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Example 1 → Normal AI query
    const aiResponse = await askOllama("Summarize this ticket: The user cannot log in to the system.");
    console.log("AI Response:", aiResponse);

    // Example 2 → DB integrated query (count)
    const dbResponse = await processPrompt("How many users are there?");
    console.log("DB Response:", dbResponse);

    // Example 3 → DB integrated query (all usernames)
    const usernames = await processPrompt("List all usernames");
    console.log("Usernames:", usernames);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sequelize.close();
  }
}

testPrompt();
