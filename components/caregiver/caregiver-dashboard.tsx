"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import CaregiverHeader from "./caregiver-header"
import RequestQueue from "./request-queue"
import PatientsList from "./patients-list"
import RedeemCodeDialog from "@/components/linking/redeem-code-dialog"
import { Card, CardContent } from "@/components/ui/card"

export default function CaregiverDashboard({ userId }: { userId: string }) {
  const [patientCount, setPatientCount] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      // Get patient count
      const { data: patientsData } = await supabase
        .from("patient_caregivers")
        .select("patient_id", { count: "exact" })
        .eq("caregiver_id", userId)

      setPatientCount(patientsData?.length || 0)

      // Get pending requests
      const { data: requestsData } = await supabase
        .from("requests")
        .select("*", { count: "exact" })
        .eq("caregiver_id", userId)
        .eq("status", "pending")

      setPendingCount(requestsData?.length || 0)
      setLoading(false)
    }

    fetchStats()
  }, [userId])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CaregiverHeader userId={userId} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Patients Linked</p>
              <p className="text-3xl font-bold">{patientCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
                  <p className="text-3xl font-bold text-accent">{pendingCount}</p>
                </div>
                {/* RedeemCodeDialog */}
                <RedeemCodeDialog caregiverId={userId} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Active Requests</h2>
            <RequestQueue caregiverId={userId} />
          </div>

          {/* Sidebar */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Patients</h2>
            <PatientsList caregiverId={userId} />
          </div>
        </div>
      </main>
    </div>
  )
}
