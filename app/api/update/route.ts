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

  const { id } = await request.json();
  const existingStory = await prismadb.story.findUnique({
    where: { id, userId },
  });
  if (!existingStory) throw new Error("Story not found");
  await prismadb.story.update({
    where: { id: existingStory.id },
    data: {
      ready: false,
      title: null,
      transcript: null,
      image_url: null,
      audio_url: null,
    },
  });

  // Send your event payload to Inngest
  await inngest.send({
    name: "telly/regenerate.story",
    data: {
      storyId: id,
      userId,
      prompt: existingStory.prompt,
    },
  });

  return NextResponse.json({ success: true });
}
