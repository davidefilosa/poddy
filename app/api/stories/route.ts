import { prismadb } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { page, favorite, query } = await request.json();
  const stories = await getStories(page, favorite, query);
  return Response.json(stories);
}

export type GetStoriesResponseType = Awaited<ReturnType<typeof getStories>>;

async function getStories(
  page: number,
  favorite: boolean,
  query: string | null,
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const stories = await prismadb.story.findMany({
    where: {
      userId,
      ...(favorite && { isFavorite: true }),
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { transcript: { contains: query, mode: "insensitive" } },
        ],
      }),
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
      ...(favorite && { isFavorite: true }),
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { transcript: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
  });

  const hasMore = totlalStories > page * 10;

  return { stories, hasMore };
}
