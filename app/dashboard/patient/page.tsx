"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PatientDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.push("/auth/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", authData.user.id)
        .single();

      if (!profileData || profileData.role !== "patient") {
        router.push("/auth/login");
        return;
      }

      setProfile(profileData);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Patient Dashboard</h1>
      <p className="mt-3">Welcome back, {profile.full_name}</p>
    </div>
  );
}
