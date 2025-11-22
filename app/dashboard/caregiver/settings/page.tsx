import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import CaregiverSettings from "@/components/settings/caregiver-settings"

export default async function CaregiverSettingsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return <CaregiverSettings userId={data.user.id} />
}
