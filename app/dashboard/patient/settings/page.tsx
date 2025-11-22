import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PatientSettings from "@/components/settings/patient-settings"

export default async function PatientSettingsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return <PatientSettings userId={data.user.id} />
}
