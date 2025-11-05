"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { OpenButton } from "./open-button";
import { GetStoriesResponseType } from "@/app/api/stories/route";
import { StoryPreview } from "./story-preview";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { HeartIcon, Loader2 } from "lucide-react";
import { useModalStore } from "@/stores/use-modal-store";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { useScroll, useMotionValueEvent, motion } from "motion/react";
import { ScrollButton } from "./scroll-button";

export const StoriesList = () => {
  const [page, setPage] = useState(1);
  const [scrolled, setScrolled] = useState(false);
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
  const ref = useRef(null);

  const { scrollY } = useScroll({ target: ref });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 64) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <div
      className="flex flex-col gap-4 p-2 md:p-8 w-full min-h-screen relative"
      ref={ref}
    >
      <motion.div
        className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between text-lg font-bold w-full sticky top-0 bg-white p-4  z-10"
        initial={{ boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
        animate={{
          boxShadow: scrolled
            ? "0px 4px 8px rgba(0,0,0,0.1)"
            : "0px 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.5 }}
      >
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
            variant="ghost"
          >
            <HeartIcon
              className={cn(
                "size-6",
                favoritesOnly ? "fill-red-500 text-red-500" : ""
              )}
            />
          </Button>
        </div>
      </motion.div>
      <div className="flex flex-col gap-4 items-center w-full ">
        {data.isPending ? (
          <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            {stories.length === 0 ? (
              <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
                <div className="text-lg text-muted-foreground">
                  No stories found.
                </div>
                <div className="text-black">
                  Adjust your search criteria or{" "}
                  <span
                    className="hover:underline cursor-pointer"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Add a story
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full auto-rows-fr">
                <OpenButton />
                <ScrollButton />
                {stories.map((story) => (
                  <StoryPreview key={story.id} story={story} />
                ))}
              </div>
            )}
          </>
        )}
        {stories.length > 0 && (
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            className="w-fit"
            disabled={!data.data?.hasMore || data.isPending}
          >
            {data.isPending ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  );
};
