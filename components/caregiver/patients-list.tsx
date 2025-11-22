"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Patient {
  patient_id: string
  full_name: string
}

export default function PatientsList({ caregiverId }: { caregiverId: string }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      const supabase = createClient()

      // Get patient IDs from relationships
      const { data: relations } = await supabase
        .from("patient_caregivers")
        .select("patient_id")
        .eq("caregiver_id", caregiverId)

      if (!relations || relations.length === 0) {
        setLoading(false)
        return
      }

      const patientIds = relations.map((r) => r.patient_id)

      // Get patient profiles
      const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", patientIds)

      setPatients(profiles?.map((p) => ({ patient_id: p.id, full_name: p.full_name })) || [])
      setLoading(false)
    }

    fetchPatients()
  }, [caregiverId])

  if (loading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No patients linked yet. Ask a patient to share their code.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {patients.map((patient) => (
        <Card key={patient.patient_id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{patient.full_name}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
