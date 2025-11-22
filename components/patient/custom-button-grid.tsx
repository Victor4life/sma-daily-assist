"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface CustomButton {
  id: string
  label: string
  color: string
  description: string
  icon_type: string
}

const colorClasses: { [key: string]: string } = {
  blue: "bg-blue-500 hover:bg-blue-600",
  green: "bg-green-500 hover:bg-green-600",
  red: "bg-red-500 hover:bg-red-600",
  purple: "bg-purple-500 hover:bg-purple-600",
  yellow: "bg-yellow-500 hover:bg-yellow-600",
  pink: "bg-pink-500 hover:bg-pink-600",
}

export default function CustomButtonGrid({
  buttons,
  userId,
}: {
  buttons: CustomButton[]
  userId: string
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleButtonClick = async (button: CustomButton) => {
    setLoading(button.id)

    try {
      const supabase = createClient()

      // Get all caregivers for this patient
      const { data: caregiverRelations } = await supabase
        .from("patient_caregivers")
        .select("caregiver_id")
        .eq("patient_id", userId)

      if (!caregiverRelations || caregiverRelations.length === 0) {
        toast({
          title: "No caregivers linked",
          description: "Please link a caregiver first",
          variant: "destructive",
        })
        setLoading(null)
        return
      }

      // Send request to first caregiver (in production, could be a notification to all)
      const caregiver_id = caregiverRelations[0].caregiver_id

      const { error } = await supabase.from("requests").insert({
        patient_id: userId,
        caregiver_id,
        button_id: button.id,
        button_label: button.label,
        request_text: button.description,
        status: "pending",
      })

      if (error) throw error

      toast({
        title: "Request sent",
        description: `"${button.label}" request sent to your caregiver`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send request",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {buttons.map((button) => (
        <Card key={button.id} className="overflow-hidden">
          <CardContent className="p-0">
            <button
              onClick={() => handleButtonClick(button)}
              disabled={loading === button.id}
              className={`w-full aspect-square ${
                colorClasses[button.color] || colorClasses.blue
              } text-white font-semibold text-center flex flex-col items-center justify-center p-4 disabled:opacity-75 transition-all`}
            >
              <span className="text-xs font-bold text-white/90 mb-2">
                {loading === button.id ? "Sending..." : "TAP"}
              </span>
              <span className="text-sm font-bold leading-tight">{button.label}</span>
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
