"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { OpenButton } from "./open-button";
import { GetStoriesResponseType } from "@/app/api/stories/route";
import { StoryPreview } from "./story-preview";
import { Button } from "../ui/button";
import { useState } from "react";
import { HeartIcon, Loader2 } from "lucide-react";
import { useModalStore } from "@/stores/use-modal-store";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useDebounce } from "@uidotdev/usehooks";

export const StoriesList = () => {
  const [page, setPage] = useState(1);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const { setOpen } = useModalStore();
  const debouncedQuery = useDebounce(query, 300);
  const data = useQuery<GetStoriesResponseType>({
    queryKey: ["stories", page, favoritesOnly, debouncedQuery],
    queryFn: () =>
      fetch("/api/stories", {
        method: "POST",
        body: JSON.stringify({ page, favoritesOnly, query: debouncedQuery }),
      }).then((res) => res.json()),
    placeholderData: keepPreviousData,
  });

  const stories = data.data?.stories || [];

  return (
    <div className="flex flex-col gap-4 p-2 md:p-8 w-full min-h-screen">
      <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between text-lg font-bold w-full">
        Your {favoritesOnly ? "Favorite" : "Last"} Stories
        <div className="flex justify-between items-center gap-2 w-full md:w-auto">
          <Input
            placeholder="Search stories..."
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button
            onClick={() => setFavoritesOnly((prev) => !prev)}
            size={"icon-lg"}
            variant={favoritesOnly ? "outline" : "ghost"}
          >
            <HeartIcon
              className={cn(
                "size-6",
                favoritesOnly ? "fill-red-500 text-red-500" : ""
              )}
            />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center w-full ">
        {data.isPending ? (
          <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            {stories.length === 0 ? (
              <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-lg text-muted-foreground">
                  No stories found. Adjust your search criteria or{" "}
                  <span
                    className="text-black hover:underline cursor-pointer"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Add a story
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full auto-rows-fr">
                <OpenButton />
                {stories.map((story) => (
                  <StoryPreview key={story.id} story={story} />
                ))}
              </div>
            )}
          </>
        )}
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          className="w-fit"
          disabled={!data.data?.hasMore || data.isPending}
        >
          {data.isPending ? "Loading..." : "Load More"}
        </Button>
      </div>
    </div>
  );
};
