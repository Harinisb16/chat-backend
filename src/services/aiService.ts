import { User } from "../models/user.model";

export async function processPrompt(prompt: string) {
  // Check if the user wants usernames
  if (prompt.toLowerCase().includes("list all usernames")) {
    const users = await User.findAll();
    return users.map(u => ({
      username: u.username,
      email: u.email,
      role: u.role.role
    }));
  }

  // Check if the user wants details for a specific user
  if (prompt.toLowerCase().startsWith("get userdetails for")) {
    const username = prompt.split("for")[1]?.trim();
    const user = await User.findOne({ where: { username } });
    if (!user) return { error: "User not found" };
    return {
      username: user.username,
      email: user.email,
      role: user.role.role
    };
  }

  // Otherwise, fallback to AI text answer
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3", prompt }),
  });

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return data.response || text;
  } catch {
    return text;
  }
}
