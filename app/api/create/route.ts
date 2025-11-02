import { NextResponse } from "next/server";
import { inngest } from "../../../inngest/client"; // Import our client
import { auth } from "@clerk/nextjs/server";

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

// Create a simple async Next.js API route handler
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, voice } = await request.json();

  // Send your event payload to Inngest
  await inngest.send({
    name: "test/generate.story",
    data: {
      topic,
      voice,
      userId,
    },
  });

  return NextResponse.json({ success: true });
}
