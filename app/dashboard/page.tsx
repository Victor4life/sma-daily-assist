// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch role from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  // Redirect based on role
  if (profile?.role === "caregiver") {
    redirect("/dashboard/caregiver");
  } else if (profile?.role === "patient") {
    redirect("/dashboard/patient");
  } else {
    redirect("/auth/login"); // fallback if role missing
  }

  return null; // redirect happens, so no UI needed
}
