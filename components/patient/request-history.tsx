"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Request {
  id: string
  button_label: string
  status: string
  created_at: string
  response_text: string | null
  completed_at: string | null
}

export default function RequestHistory({ userId }: { userId: string }) {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("requests")
        .select("*")
        .eq("patient_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)

      setRequests(data || [])
      setLoading(false)
    }

    fetchRequests()
  }, [userId])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No requests yet. Tap a button to send your first request!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{request.button_label}</p>
              <p className="text-xs text-muted-foreground">{new Date(request.created_at).toLocaleString()}</p>
            </div>
            <Badge variant={request.status === "completed" ? "default" : "secondary"}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
