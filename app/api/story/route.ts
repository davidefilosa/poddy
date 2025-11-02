import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { id } = await request.json();
  const story = await getStory(id);
  return Response.json(story);
}

export type GetStoryResponseType = Awaited<ReturnType<typeof getStory>>;

async function getStory(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const story = await prismadb.story.findUnique({
    where: {
      id,
      userId,
    },
  });
  return story;
}
