import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from("fabletunes")
    .upload(`public/${file.name.toLowerCase()}`, file);

  const { data: url } = supabase.storage
    .from("fabletunes")
    .getPublicUrl(`public/${file.name.toLocaleLowerCase()}`);

  return url;
};

export const deleteFile = async (fileUrl: string) => {
  const path = fileUrl.split("/fabletunes/")[1];
  const { data, error } = await supabase.storage
    .from("fabletunes")
    .remove([path]);
};
