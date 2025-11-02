import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const stories = await getStories();
  return Response.json(stories);
}

export type GetStoriesResponseType = Awaited<ReturnType<typeof getStories>>;

async function getStories() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const stories = await prismadb.story.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return stories;
}
