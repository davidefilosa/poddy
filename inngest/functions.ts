import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "./client";
import Replicate from "replicate";
import { uploadFile } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import { prismadb } from "@/lib/prismadb";

export const generateStory = inngest.createFunction(
  { id: "generate-story" },
  { event: "telly/generate.story" },
  async ({ event, step }) => {
    const userId = event.data.userId;
    if (!userId) throw new Error("User not authenticated");

    const story = await step.run("generate-story", async () => {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-pro-preview-03-25",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const content = `
        You are an engaging and creative teaching assistant.  
        Based on a topic provided by the user (something they want to learn), you will generate four elements:

        1. **Transcript** – Explain the topic in an engaging, conversational, and easy-to-understand way.
           Make it clear, vivid, and memorable — use relatable examples, analogies, or real-world context to help the user truly understand the concept.
        
        2. **Title** – Create a short, catchy title (max 8 words) that captures the essence of the story.
        
        3. **Image Prompt** – Write a detailed visual prompt that captures the key scene, mood, and atmosphere of the story. The prompt should be descriptive enough for an image generation model (like DALL·E or Midjourney) to visualize accurately.
        
        4. **Voice Instructions** – Provide clear narration instructions for OpenAI Whisper or a text-to-speech model, specifying tone, pacing, and emotion. For example: "Warm and calm tone, medium pacing, cinematic delivery."
        
        Output must be in **valid JSON** format:
        {
          "title": "string",
          "transcript": "string",
          "image_prompt": "string",
          "voice_instructions": "string"
        }
        
        Topic: "${event.data.topic}"
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
    });

    await step.run("store-transcript", async () => {
      await prismadb.story.update({
        where: { id: event.data.storyId },
        data: {
          title: story.title,
          transcript: story.transcript,
        },
      });
    });

    const audio_url = await step.run("generate-audio", async () => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const mp3 = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: event.data.voice === "FEMALE" ? "shimmer" : "echo",
        input: story.transcript,
        instructions: story.voice_instructions,
      });
      const buffer = Buffer.from(await mp3.arrayBuffer());
      const file = new File([buffer], `${uuidv4()}.mp3`);
      const audioUrl = await uploadFile(file);
      return audioUrl.publicUrl;
    });

    await step.run("store-audio", async () => {
      await prismadb.story.update({
        where: { id: event.data.storyId },
        data: {
          audio_url,
        },
      });
    });

    const image_url = await step.run("generate-photo", async () => {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      });
      const input = {
        prompt: story.image_prompt,
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
    });

    await step.run("store-image", async () => {
      await prismadb.story.update({
        where: { id: event.data.storyId },
        data: {
          image_url,
        },
      });
    });

    await step.run("store-story", async () => {
      const storyData = await prismadb.story.update({
        where: { id: event.data.storyId },
        data: {
          ready: true,
        },
      });
      return storyData;
    });
  }
);
