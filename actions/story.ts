"use server";
import { uploadFile } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Replicate from "replicate";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import { StoryFormSchemaType, StoryFormSchema } from "@/form-schemas/story";
import { auth } from "@clerk/nextjs/server";
import { prismadb } from "@/lib/prismadb";

async function generateStory(topic: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro-preview-03-25",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const content = `
You are a creative storytelling assistant.
Based on a topic provided by the user, you will generate four elements:

1. **Story** – Write an engaging and educational story that explains or teaches the topic in a vivid, easy-to-understand, and memorable way. The story should spark curiosity, include relatable examples or metaphors, and be suitable for both text and voice narration.

2. **Title** – Create a short, catchy title (max 8 words) that captures the essence of the story.

3. **Image Prompt** – Write a detailed visual prompt that captures the key scene, mood, and atmosphere of the story. The prompt should be descriptive enough for an image generation model (like DALL·E or Midjourney) to visualize accurately.

4. **Voice Instructions** – Provide clear narration instructions for OpenAI Whisper or a text-to-speech model, specifying tone, pacing, and emotion. For example: "Warm and calm tone, medium pacing, cinematic delivery."

Output must be in **valid JSON** format:
{
  "title": "string",
  "story": "string",
  "image_prompt": "string",
  "voice_instructions": "string"
}

Topic: "${topic}"
      `;
  const result = await model.generateContent(content);
  const response = result.response;
  console.log(response.text());
  const text = response
    .text()
    .replace("```json", "")
    .replace("```", "")
    .replace("ny", "");
  console.log(text);
  const json = JSON.parse(text);
  return json;
}

async function generatePhotoGoogle(prompt: string) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });
  const input = {
    prompt,
    output_format: "png",
    aspect_ratio: "16:9",
    safety_filter_level: "block_medium_and_above",
  };

  const response = await replicate.run("google/imagen-4", {
    input,
  });
  // response may be a string or other type; coerce to string for URL constructor
  const fluxImageUrl = new URL(String(response));
  const fetchFile = await fetch(fluxImageUrl.href);
  const responseBlob = await fetchFile.blob();
  const file = new File([responseBlob], `${uuidv4()}.png`);
  const fileUrl = await uploadFile(file);
  return fileUrl.publicUrl;
}

async function generateAudio(values: {
  story: string;
  voice_instructions: string;
  voice: "MALE" | "FEMALE";
}) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const mp3 = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: values.voice === "FEMALE" ? "shimmer" : "echo",
    input: values.story,
    instructions: values.voice_instructions,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  const file = new File([buffer], `${uuidv4()}.mp3`);
  const audioUrl = await uploadFile(file);
  return audioUrl.publicUrl;
}

type GeneratedStory = {
  title: string;
  story: string;
  image_prompt: string;
  voice_instructions: string;
};

export async function createStoryAction(values: StoryFormSchemaType) {
  const parsedBody = StoryFormSchema.safeParse(values);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!parsedBody.success) {
    throw new Error("Invalid form data");
  }

  const generatedStory: GeneratedStory = await generateStory(values.topic);

  const imageUrl = await generatePhotoGoogle(generatedStory.image_prompt);

  const audioUrl = await generateAudio({
    story: generatedStory.story,
    voice_instructions: generatedStory.voice_instructions,
    voice: values.voice,
  });

  const storyData = await prismadb.story.create({
    data: {
      userId,
      title: generatedStory.title,
      transcript: generatedStory.story,
      image_url: imageUrl,
      audio_url: audioUrl,
      prompt: values.topic,
    },
  });
  return storyData;
}
