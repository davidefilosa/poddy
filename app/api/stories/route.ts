import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { page } = await request.json();
  const stories = await getStories(page);
  return Response.json(stories);
}

export type GetStoriesResponseType = Awaited<ReturnType<typeof getStories>>;

async function getStories(page: number) {
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
    skip: 0,
    take: page * 11,
  });

  const totlalStories = await prismadb.story.count({
    where: {
      userId,
    },
  });

  const hasMore = totlalStories > page * 10;

  return { stories, hasMore };
}
