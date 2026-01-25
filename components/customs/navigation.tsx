"use client";

import { GetStoriesResponseType } from "@/app/api/navigation/route";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavigationProps {
  id: string;
}

export const Navigation = ({ id }: NavigationProps) => {
  const router = useRouter();
  const data = useQuery<GetStoriesResponseType>({
    queryKey: ["navigation", id],
    queryFn: () =>
      fetch("/api/navigation", {
        method: "POST",
        body: JSON.stringify({ id }),
      }).then((res) => res.json()),
  });

  console.log(data.data);

  return (
    <div className="flex flex-col gap-2 max-w-5xl mx-auto w-full mt-4">
      <div className="font-semibold">See the other stories</div>
      <div className="flex gap-2 w-full  border p-2 rounded-lg">
        {data.data?.map((story) => (
          <div
            key={story?.id}
            className={cn(
              "w-full relative h-32 rounded-md overflow-hidden cursor-pointer hover:opacity-100 transition-opacity",
              story?.id === id ? "border-2 border-blue-500" : "opacity-50",
            )}
            onClick={() => router.push(`/story/${story?.id}`)}
          >
            <Image
              src={story?.image_url || "/placeholder.jpg"}
              alt={story?.title || "Untitled Story"}
              fill
              className="w-full object-cover h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
