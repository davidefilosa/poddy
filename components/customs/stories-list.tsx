"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { OpenButton } from "./open-button";
import { GetStoriesResponseType } from "@/app/api/stories/route";
import { StoryPreview } from "./story-preview";
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const StoriesList = () => {
  const [page, setPage] = useState(1);
  const data = useQuery<GetStoriesResponseType>({
    queryKey: ["stories", page],
    queryFn: () =>
      fetch("/api/stories", {
        method: "POST",
        body: JSON.stringify({ page }),
      }).then((res) => res.json()),
    placeholderData: keepPreviousData,
  });

  const stories = data.data?.stories;

  if (data.isPending || !stories) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">No stories found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full p-2 md:p-8 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full auto-rows-fr">
        <OpenButton />
        {stories.map((story) => (
          <StoryPreview key={story.id} story={story} />
        ))}
      </div>
      <Button
        onClick={() => setPage((prev) => prev + 1)}
        className="w-fit"
        disabled={!data.data?.hasMore || data.isPending}
      >
        {data.isPending ? "Loading..." : "Load More"}
      </Button>
    </div>
  );
};
