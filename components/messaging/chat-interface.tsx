"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  sender_id: string
  message_text: string
  created_at: string
  is_read: boolean
}

interface OtherUser {
  full_name: string
}

export default function ChatInterface({
  requestId,
  userId,
  userRole,
}: {
  requestId: string
  userId: string
  userRole: "patient" | "caregiver"
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null)
  const [request, setRequest] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch request
      const { data: requestData } = await supabase.from("requests").select("*").eq("id", requestId).single()

      setRequest(requestData)

      if (!requestData) {
        setLoading(false)
        return
      }

      // Fetch other user
      const otherUserId = userRole === "patient" ? requestData.caregiver_id : requestData.patient_id

      const { data: profileData } = await supabase.from("profiles").select("full_name").eq("id", otherUserId).single()

      setOtherUser(profileData)

      // Fetch messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: true })

      setMessages(messagesData || [])

      // Mark messages as read
      if (messagesData) {
        const unreadIds = messagesData.filter((m) => m.receiver_id === userId && !m.is_read).map((m) => m.id)

        if (unreadIds.length > 0) {
          await supabase.from("messages").update({ is_read: true }).in("id", unreadIds)
        }
      }

      // Subscribe to new messages
      const subscription = supabase
        .channel(`chat:${requestId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `request_id=eq.${requestId}` },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message])
          },
        )
        .subscribe()

      setLoading(false)

      return () => {
        subscription.unsubscribe()
      }
    }

    fetchData()
  }, [requestId, userId, userRole])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !request) return

    setSending(true)

    try {
      const supabase = createClient()
      const receiverId = userRole === "patient" ? request.caregiver_id : request.patient_id

      const { error } = await supabase.from("messages").insert({
        sender_id: userId,
        receiver_id: receiverId,
        request_id: requestId,
        message_text: newMessage,
      })

      if (error) throw error

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading chat...</div>
  }

  const backUrl = userRole === "patient" ? "/dashboard/patient" : "/dashboard/caregiver"

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-4">
          <Link href={backUrl}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="font-semibold">{otherUser?.full_name || "Chat"}</h2>
            <p className="text-xs text-muted-foreground">{request?.button_label}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">Start a conversation</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender_id === userId ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender_id === userId ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.message_text}</p>
                <p className={`text-xs mt-1 ${message.sender_id === userId ? "opacity-70" : "text-muted-foreground"}`}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 bg-card">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1"
          />
          <Button type="submit" disabled={sending || !newMessage.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
