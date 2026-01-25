import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { id } = await request.json();
  const stories = await getStories(id);
  return Response.json(stories);
}

export type GetStoriesResponseType = Awaited<ReturnType<typeof getStories>>;

async function getStories(id: string) {
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

  const currentStory = await prismadb.story.findUnique({
    where: {
      id,
      userId,
    },
  });

  const index = stories.findIndex((story) => story.id === id);

  let beforeStories = stories.slice(Math.max(0, index - 2), index);
  let afterStories = stories.slice(index + 1, index + 3);
  if (beforeStories.length < 2) {
    const needed = 2 - beforeStories.length;
    afterStories = stories.slice(index + 1, index + 3 + needed);
  }

  if (afterStories.length < 2) {
    const needed = 2 - afterStories.length;
    beforeStories = stories.slice(Math.max(0, index - 2 - needed), index);
  }

  const finalStories = [...beforeStories, currentStory, ...afterStories];

  return finalStories;
}
