import { StoryDetail } from "@/components/customs/story-detail";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface StoryIdPageProps {
  params: Promise<{ id: string }>;
}

const StoryIdPage = async ({ params }: StoryIdPageProps) => {
  const user = auth();
  if (!user) {
    return redirect("/sign-in");
  }
  const { id } = await params;
  return <StoryDetail id={id} />;
};

export default StoryIdPage;
