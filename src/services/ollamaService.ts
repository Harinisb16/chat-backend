import fetch from "node-fetch";
import User from "../models/user.model";
import { Role } from "../models/role.model";
import { Team } from "../models/team.model";
import { Ticket } from "../models/ticket.model";
import { Sprint } from "../models/sprint.model";

interface OllamaOutput {
  type: string;
  text: string;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  output?: OllamaOutput[];
  response?: string;
  done: boolean;
  done_reason?: string;
}






export async function askOllama(prompt: string): Promise<string> {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt,
        max_tokens: 2000,
        stream: false,
      }),
    });

    if (!res.ok) throw new Error(`Ollama API error: ${res.status} ${res.statusText}`);

    const data: OllamaResponse = (await res.json()) as OllamaResponse;
    if (data.output && Array.isArray(data.output)) {
      return data.output.map((o) => o.text).join("\n").trim();
    }
    return data.response || "No response from Ollama.";
  } catch (error: any) {
    return `❌ Failed to connect to Ollama: ${error.message}`;
  }
}

function buildPrompt(context: string, instruction: string): string {
  return `
You are a professional AI assistant for an ALM tool.
Context:
${context}

Instruction:
${instruction}

Rules:
- Respond in a professional and concise tone.
- Do NOT add irrelevant text, emojis, or unnecessary greetings.
- If listing, use bullet points or numbered lists.
- Keep responses clear and easy to read.
`;
}

export async function processPrompt(prompt: string) {
  const lowerPrompt = prompt.toLowerCase().trim();

  // ✅ Users
  if (lowerPrompt.includes("how many users")) {
    const count = await User.count();
    return askOllama(buildPrompt(`Total users: ${count}`, `Answer: "There are ${count} users in the system."`));
  }

  if (lowerPrompt.includes("list all usernames")) {
    const users = await User.findAll({ include: [Role] });
    const userList = users.map(u => ({
      username: u.username,
      email: u.email,
      role: u.role?.role || "N/A",
    }));
    return askOllama(buildPrompt(
      JSON.stringify(userList, null, 2),
      "List all usernames with email and role. Provide a short summary at the end."
    ));
  }

  if (lowerPrompt.startsWith("get userdetails for")) {
    const username = prompt.split("for")[1]?.trim();
    if (!username) return "Please provide a username.";
    const user = await User.findOne({ where: { username }, include: [Role, Team] });
    if (!user) return "User not found.";
    const details = {
      username: user.username,
      email: user.email,
      role: user.role?.role || "N/A",
      teams: user.teams?.map(t => t.teamName) || [],
    };
    return askOllama(buildPrompt(
      JSON.stringify(details, null, 2),
      "Summarize this user's profile in 2-3 sentences."
    ));
  }



  // ✅ Get all sprint names
  if (lowerPrompt.includes("list all sprints")) {
    const sprints = await Sprint.findAll({ attributes: ["sprintname"] });
    const sprintNames = sprints.map(s => s.sprintname).join("\n") || "No sprints found";

    return askOllama(buildPrompt(
      `Sprint Names:\n${sprintNames}`,
      "List all sprint names vertically, one per line."
    ));
  }

    // ✅ List sprints by specific status
  if (lowerPrompt.includes("list planned sprints")) {
    const plannedSprints = await Sprint.findAll({ where: { status: "Planned" }, attributes: ["sprintname"] });
    const names = plannedSprints.map(s => s.sprintname).join("\n") || "No planned sprints";
    return askOllama(buildPrompt(
      `Planned Sprints:\n${names}`,
      "List all planned sprint names vertically, one per line."
    ));
  }

  if (lowerPrompt.includes("list in progress sprints")) {
    const inProgressSprints = await Sprint.findAll({ where: { status: "In Progress" }, attributes: ["sprintname"] });
    const names = inProgressSprints.map(s => s.sprintname).join("\n") || "No sprints in progress";
    return askOllama(buildPrompt(
      `In Progress Sprints:\n${names}`,
      "List all in-progress sprint names vertically, one per line."
    ));
  }

  if (lowerPrompt.includes("list closed sprints")) {
    const closedSprints = await Sprint.findAll({ where: { status: "Closed" }, attributes: ["sprintname"] });
    const names = closedSprints.map(s => s.sprintname).join("\n") || "No closed sprints";
    return askOllama(buildPrompt(
      `Closed Sprints:\n${names}`,
      "List all closed sprint names vertically, one per line."
    ));
  }

  // ✅ Get sprint details (planned, in progress, completed)
  if (lowerPrompt.includes("sprint status count")) {
    const plannedCount = await Sprint.count({ where: { status: "Planned" } });
    const inProgressCount = await Sprint.count({ where: { status: "In Progress" } });
    const completedCount = await Sprint.count({ where: { status: "Completed" } });

    const statusSummary = `
Planned: ${plannedCount}
In Progress: ${inProgressCount}
Completed: ${completedCount}
`;

    return askOllama(buildPrompt(
      statusSummary,
      "Respond with the sprint status counts in a professional format."
    ));
  }

  // ✅ Get detailed sprint info
  if (lowerPrompt.includes("detailed sprint list")) {
    const sprints = await Sprint.findAll();
    const sprintData = sprints.map(s => ({
      sprintname: s.sprintname,
      project: s.project,
      team: s.team,
      status: s.status,
      goal: s.goal,
      startdate: s.startdate,
      enddate: s.enddate,
    }));

    return askOllama(buildPrompt(
      JSON.stringify(sprintData, null, 2),
      "List all sprint details clearly in a professional format."
    ));


    
  }















  // ✅ Teams
  if (lowerPrompt.includes("how many teams")) {
    const count = await Team.count();
    return askOllama(buildPrompt(`Total teams: ${count}`, `Answer: "There are ${count} teams in the system."`));
  }

// Teams
if (lowerPrompt.includes("list all teams")) {
  const teams = await Team.findAll();
  const teamNames = teams.map(t => t.teamName);
  
  const aiPrompt = `
You are an AI assistant.
Here is the team data:
${JSON.stringify(teamNames)}

Instruction:
- Only list the team names in a single line or comma-separated.
- Do NOT add members, project IDs, or extra formatting.
`;
  return askOllama(aiPrompt);
}

if (lowerPrompt.startsWith("list members of")) {
  const teamName = prompt.split("of")[1]?.trim();
  if (!teamName) return "Please provide a team name.";

  const team = await Team.findOne({ 
    where: { teamName }, 
    include: [User] 
  });
  if (!team) return "Team not found.";

  const memberNames = team.users?.map(u => u.username).join(", ") || "No members";

  const aiPrompt = `
You are an AI assistant.
Team Name: ${team.teamName}
Members: ${memberNames}

Instruction:
- Respond ONLY with the team name and member usernames.
- Do NOT add bullets, placeholders, greetings, or extra text.
- Format like: "Team AOP: Nadheem, Eask, Nithaya Kumar"
`;

  return askOllama(aiPrompt);
}


if (lowerPrompt.startsWith("count members of")) {
  const teamName = prompt.split("of")[1]?.trim();
  if (!teamName) return "Please provide a team name.";

  const team = await Team.findOne({ 
    where: { teamName }, 
    include: [User] 
  });
  if (!team) return "Team not found.";

  const memberCount = team.users?.length || 0;

  const aiPrompt = `
You are an AI assistant.
Team Name: ${team.teamName}
Member Count: ${memberCount}

Instruction:
- Respond ONLY with the total number of members.
- Format like: "Total members: 3"
- Do NOT include names, bullets, or extra text.
`;

  return askOllama(aiPrompt);
}



  // ✅ Tickets
  if (lowerPrompt.includes("how many tickets")) {
    const count = await Ticket.count();
    return askOllama(buildPrompt(`Total tickets: ${count}`, `Answer: "There are ${count} tickets in the system."`));
  }

if (lowerPrompt.includes("list all open tickets")) {
  // Fetch only open tickets
  const tickets = await Ticket.findAll({
    where: { status: "Open" },
    attributes: ["title"], // only need title
    group: ["title"],      // distinct titles
  });

  // Map titles to vertical format
  const ticketTitles = tickets.map(t => t.title).join("\n") || "No open tickets";

  const aiPrompt = `
You are an AI assistant.
Open Ticket Titles:
${ticketTitles}

Instructions:
- Respond ONLY with one ticket title per line.
- Do NOT include duplicates, IDs, status, priority, sprint, or extra text.
`;

  return askOllama(aiPrompt);
}


  if (lowerPrompt.startsWith("get ticket details for")) {
    const id = Number(prompt.split("for")[1]?.trim());
    if (isNaN(id)) return "Please provide a valid ticket ID.";
    const ticket = await Ticket.findByPk(id, { include: ["childTickets"] });
    if (!ticket) return "Ticket not found.";
    return askOllama(buildPrompt(
      JSON.stringify(ticket, null, 2),
      "Summarize this ticket details (title, status, priority, sprint, owner, reporting manager) in 3 sentences."
    ));
  }

  // Default → let Ollama handle free-form queries
  return askOllama(buildPrompt("No DB context available", `Respond to: ${prompt}`));
}



