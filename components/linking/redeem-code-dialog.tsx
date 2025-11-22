"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function RedeemCodeDialog({ caregiverId }: { caregiverId: string }) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)

    try {
      const supabase = createClient()

      // Find the linking code
      const { data: linkingData } = await supabase
        .from("linking_codes")
        .select("*")
        .eq("code", code.toUpperCase())
        .single()

      if (!linkingData) {
        throw new Error("Invalid code")
      }

      if (new Date(linkingData.expires_at) < new Date()) {
        throw new Error("Code has expired")
      }

      if (linkingData.used_by) {
        throw new Error("Code has already been used")
      }

      // Create the patient-caregiver relationship
      const { error: linkError } = await supabase.from("patient_caregivers").insert({
        patient_id: linkingData.patient_id,
        caregiver_id: caregiverId,
      })

      if (linkError) {
        if (linkError.message.includes("duplicate")) {
          throw new Error("Already linked to this patient")
        }
        throw linkError
      }

      // Mark code as used
      await supabase
        .from("linking_codes")
        .update({
          used_by: caregiverId,
          used_at: new Date().toISOString(),
        })
        .eq("id", linkingData.id)

      toast({
        title: "Linked successfully",
        description: "You can now support this patient",
      })

      setCode("")
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to link",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Enter Code</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link with Patient</DialogTitle>
          <DialogDescription>Enter the 6-digit code provided by the patient</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleRedeem} className="space-y-4">
          <div>
            <Label htmlFor="code">Linking Code</Label>
            <Input
              id="code"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono mt-2"
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !code.trim()}>
            {loading ? "Linking..." : "Link Patient"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
