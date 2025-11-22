import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PatientDashboard from "@/components/patient/patient-dashboard"

export default async function PatientPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is a patient
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

  if (profile?.role !== "patient") {
    redirect("/dashboard/caregiver")
  }

  return <PatientDashboard userId={data.user.id} />
}
