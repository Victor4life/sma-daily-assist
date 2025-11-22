"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Profile {
  full_name: string
  avatar_url: string | null
}

export default function CaregiverHeader({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", userId).single()

      setProfile(data)
    }

    fetchProfile()
  }, [userId])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">SMA Daily Assist</h1>
          <p className="text-sm text-muted-foreground">Caregiver Dashboard</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">{profile?.full_name || "Caregiver"}</p>
            <p className="text-xs text-muted-foreground">Support Mode</p>
          </div>

          <div className="flex gap-2">
            <Link href="/dashboard/caregiver/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
