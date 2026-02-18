"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ollamaService_1 = require("./services/ollamaService");
const db_1 = require("./config/db");
async function testPrompt() {
    try {
        await db_1.sequelize.authenticate();
        console.log("✅ Database connected");
        // Example 1 → Normal AI query
        const aiResponse = await (0, ollamaService_1.askOllama)("Summarize this ticket: The user cannot log in to the system.");
        console.log("AI Response:", aiResponse);
        // Example 2 → DB integrated query (count)
        const dbResponse = await (0, ollamaService_1.processPrompt)("How many users are there?");
        console.log("DB Response:", dbResponse);
        // Example 3 → DB integrated query (all usernames)
        const usernames = await (0, ollamaService_1.processPrompt)("List all usernames");
        console.log("Usernames:", usernames);
    }
    catch (err) {
        console.error("Error:", err);
    }
    finally {
        await db_1.sequelize.close();
    }
}
testPrompt();
