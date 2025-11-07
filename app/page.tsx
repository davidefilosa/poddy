import { Stories } from "@/components/customs/stories";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = auth();
  if (!user) {
    return redirect("/sign-in");
  }
  return (
    <div>
      <Stories />
    </div>
  );
}
