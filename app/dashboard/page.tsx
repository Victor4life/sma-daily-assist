"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data?.user) {
        router.push("/auth/login");
        return;
      }

      // Fetch role
      supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile?.role === "caregiver") {
            router.push("/dashboard/caregiver");
          } else if (profile?.role === "patient") {
            router.push("/dashboard/patient");
          } else {
            router.push("/auth/login");
          }
        });
    });
  }, [router]);

  return <p>Loading...</p>;
}
