import { assistantId } from "@/app/assistant/assistant-config";
import { openai } from "@/lib/openai";
export const runtime = "nodejs";

export async function POST(request) {
  const { type, name, instruction } = await request.json();
  let assistant;

  if (type === "file") {
    assistant = await openai.beta.assistants.create({
      instructions: instruction === "" ? "You are a helpful assistant." : instruction,
      name: name,
      model: "gpt-4-turbo",
      tools: [
        { type: "file_search" },
      ],
    });
  }
  else if (type === "website") {
    assistant = await openai.beta.assistants.create({
      instructions: instruction === "" ? "You are a helpful assistant for website." : instruction,
      name: name,
      model: "gpt-4-turbo",
      tools: [
        { type: "file_search" },
      ],
    });
  }

  return Response.json({ assistantId: assistant.id });
}

export async function DELETE(request) {
  const body = await request.json();
  const assistantId = body.id;

  await openai.beta.assistants.del(assistantId);

  return new Response();
}