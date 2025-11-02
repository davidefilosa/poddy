import { StoryDetail } from "@/components/customs/story-detail";
import React from "react";

interface StoryIdPageProps {
  params: Promise<{ id: string }>;
}

const StoryIdPage = async ({ params }: StoryIdPageProps) => {
  const { id } = await params;
  return <StoryDetail id={id} />;
};

export default StoryIdPage;
