import { NextResponse } from "next/server";
import { inngest } from "../../../inngest/client"; // Import our client
import { auth } from "@clerk/nextjs/server";
import { prismadb } from "@/lib/prismadb";

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

// Create a simple async Next.js API route handler
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, voice } = await request.json();

  const story = await prismadb.story.create({
    data: {
      prompt: topic,
      userId,
    },
  });

  // Send your event payload to Inngest
  await inngest.send({
    name: "test/generate.story",
    data: {
      topic,
      voice,
      userId,
      storyId: story.id,
    },
  });

  return NextResponse.json(story);
}
