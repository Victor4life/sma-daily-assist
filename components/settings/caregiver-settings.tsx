"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface AccessibilitySettings {
  font_size: string
  high_contrast: boolean
  reduce_motion: boolean
  screen_reader_mode: boolean
  dark_mode: boolean
}

export default function CaregiverSettings({ userId }: { userId: string }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    font_size: "normal",
    high_contrast: false,
    reduce_motion: false,
    screen_reader_mode: false,
    dark_mode: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("accessibility_settings").select("*").eq("user_id", userId).single()

      if (data) {
        setSettings(data)
      }
      setLoading(false)
    }

    fetchSettings()
  }, [userId])

  const handleSaveSettings = async () => {
    setSaving(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("accessibility_settings").update(settings).eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          <Link href="/dashboard/caregiver">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Caregiver Settings</h1>
            <p className="text-sm text-muted-foreground">Preferences</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Display</CardTitle>
            <CardDescription>Customize how content is displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <Select
                value={settings.font_size}
                onValueChange={(value) => setSettings({ ...settings, font_size: value })}
              >
                <SelectTrigger id="fontSize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extra-large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch
                id="darkMode"
                checked={settings.dark_mode}
                onCheckedChange={(checked) => setSettings({ ...settings, dark_mode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSaveSettings} disabled={saving} className="px-8">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Link href="/dashboard/caregiver">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
