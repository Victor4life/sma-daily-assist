"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle } from "lucide-react"

interface Request {
  id: string
  button_label: string
  request_text: string
  patient_id: string
  status: string
  created_at: string
  urgent: boolean
}

export default function RequestQueue({ caregiverId }: { caregiverId: string }) {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("requests")
        .select("*")
        .eq("caregiver_id", caregiverId)
        .eq("status", "pending")
        .order("urgent", { ascending: false })
        .order("created_at", { ascending: true })

      setRequests(data || [])
      setLoading(false)
    }

    fetchRequests()
  }, [caregiverId])

  const handleMarkComplete = async (requestId: string) => {
    setProcessingId(requestId)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("requests")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      if (error) throw error

      setRequests(requests.filter((r) => r.id !== requestId))
    } catch (error) {
      console.error("Error completing request:", error)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No pending requests. Everything is handled!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className={`border-l-4 ${request.urgent ? "border-l-red-500" : "border-l-primary"}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{request.button_label}</h3>
                  {request.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      URGENT
                    </Badge>
                  )}
                </div>
                {request.request_text && <p className="text-sm text-muted-foreground mb-2">{request.request_text}</p>}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(request.created_at).toLocaleTimeString()}
                </div>
              </div>

              <Button
                onClick={() => handleMarkComplete(request.id)}
                disabled={processingId === request.id}
                className="gap-2 whitespace-nowrap"
              >
                <CheckCircle className="w-4 h-4" />
                {processingId === request.id ? "Marking..." : "Done"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
