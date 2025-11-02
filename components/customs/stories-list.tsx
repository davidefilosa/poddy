"use client";

import { useQuery } from "@tanstack/react-query";
import { OpenButton } from "./open-button";
import { GetStoriesResponseType } from "@/app/api/stories/route";
import { StoryPreview } from "./story-preview";

export const StoriesList = () => {
  const stories = useQuery<GetStoriesResponseType>({
    queryKey: ["stories"],
    queryFn: () => fetch("/api/stories").then((res) => res.json()),
  });

  return (
    <div className="w-full p-2 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <OpenButton />
      {stories.data?.map((story) => (
        <StoryPreview key={story.id} story={story} />
      ))}
    </div>
  );
};
