"use client";

import { StoryFormSchema, StoryFormSchemaType } from "@/form-schemas/story";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModalStore } from "@/stores/use-modal-store";
import { toast } from "sonner";

export const CreateForm = () => {
  const { setOpen } = useModalStore();
  const form = useForm<StoryFormSchemaType>({
    resolver: zodResolver(StoryFormSchema),
    defaultValues: {
      topic: "",
      voice: "FEMALE",
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: StoryFormSchemaType) => {
      const parsedValues = StoryFormSchema.safeParse(values);
      if (!parsedValues.success) {
        throw new Error("Invalid form data");
      }

      const { topic, voice } = parsedValues.data;

      const story = await fetch("/api/create", {
        method: "POST",
        body: JSON.stringify({ topic, voice }),
      }).then((res) => res.json());

      console.log(story);

      return story;
    },
    onSuccess: async () => {
      form.reset();
      setOpen(false);
      toast.success("Story created", {
        id: "story",
      });
      await queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "story",
      });
    },
  });

  function onSubmit(values: StoryFormSchemaType) {
    toast.loading("Creating your story...", {
      id: "story",
    });
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="Enter topic" {...field} />
              </FormControl>
              <FormDescription>
                This is the topic of your story.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MALE" />
                    </FormControl>
                    <FormLabel className="font-normal">Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="FEMALE" />
                    </FormControl>
                    <FormLabel className="font-normal">Female</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>Chose a voice for your story.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};
