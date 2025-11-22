import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ChatInterface from "@/components/messaging/chat-interface"

export default async function ChatPage({
  params,
}: {
  params: { requestId: string }
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return <ChatInterface requestId={params.requestId} userId={data.user.id} userRole="caregiver" />
}
