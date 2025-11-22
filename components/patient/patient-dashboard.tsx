"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PatientHeader from "./patient-header"
import CustomButtonGrid from "./custom-button-grid"
import RequestHistory from "./request-history"
import GenerateCodeDialog from "@/components/linking/generate-code-dialog"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface CustomButton {
  id: string
  label: string
  color: string
  description: string
  icon_type: string
}

export default function PatientDashboard({ userId }: { userId: string }) {
  const [buttons, setButtons] = useState<CustomButton[]>([])
  const [caregivers, setCaregivers] = useState<number>(0)
  const [pendingRequests, setPendingRequests] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch custom buttons
      const { data: buttonsData } = await supabase
        .from("custom_buttons")
        .select("*")
        .eq("patient_id", userId)
        .order("order_index", { ascending: true })

      setButtons(buttonsData || [])

      // Fetch caregiver count
      const { data: caregiversData } = await supabase
        .from("patient_caregivers")
        .select("caregiver_id", { count: "exact" })
        .eq("patient_id", userId)

      setCaregivers(caregiversData?.length || 0)

      // Fetch pending requests
      const { data: requestsData } = await supabase
        .from("requests")
        .select("*", { count: "exact" })
        .eq("patient_id", userId)
        .eq("status", "pending")

      setPendingRequests(requestsData?.length || 0)

      setLoading(false)
    }

    fetchData()
  }, [userId])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PatientHeader userId={userId} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connected Caregivers</p>
                  <p className="text-3xl font-bold">{caregivers}</p>
                </div>
                <GenerateCodeDialog patientId={userId} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <p className="text-3xl font-bold">{pendingRequests}</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Custom Buttons Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Quick Actions</h2>
              <p className="text-sm text-muted-foreground">Tap to send requests to your caregivers</p>
            </div>
            <Button className="rounded-full gap-2">
              <Plus className="w-4 h-4" />
              Add Button
            </Button>
          </div>

          {buttons.length > 0 ? (
            <CustomButtonGrid buttons={buttons} userId={userId} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No quick action buttons yet</p>
                <Button>Create Your First Button</Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Requests</h2>
          <RequestHistory userId={userId} />
        </section>
      </main>
    </div>
  )
}
