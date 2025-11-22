import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import CaregiverDashboard from "@/components/caregiver/caregiver-dashboard"

export default async function CaregiverPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is a caregiver
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (profile?.role !== "caregiver") {
    redirect("/dashboard/patient")
  }

  return <CaregiverDashboard userId={data.user.id} />
}
