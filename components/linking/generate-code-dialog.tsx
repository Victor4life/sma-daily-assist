"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Copy, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GenerateCodeDialog({ patientId }: { patientId: string }) {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const generateCode = async () => {
    setLoading(true)

    try {
      const supabase = createClient()

      // Generate a random 6-digit code
      const newCode = Math.random().toString().slice(2, 8).padEnd(6, "0")

      // Set expiration to 24 hours from now
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      const { error } = await supabase.from("linking_codes").insert({
        patient_id: patientId,
        code: newCode,
        expires_at: expiresAt.toISOString(),
      })

      if (error) throw error

      setCode(newCode)
      toast({
        title: "Code generated",
        description: "Share this code with your caregiver",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate code",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code)
      toast({
        title: "Copied",
        description: "Code copied to clipboard",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Generate Linking Code</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link a Caregiver</DialogTitle>
          <DialogDescription>
            Generate a code to share with your caregiver so they can access your account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {code ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Share this code:</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-muted p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold tracking-widest">{code}</p>
                </div>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Valid for 24 hours</p>
              <Button
                variant="outline"
                className="w-full mt-4 gap-2 bg-transparent"
                onClick={() => {
                  setCode(null)
                  generateCode()
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Generate New Code
              </Button>
            </div>
          ) : (
            <Button onClick={generateCode} disabled={loading} className="w-full" size="lg">
              {loading ? "Generating..." : "Generate Code"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
