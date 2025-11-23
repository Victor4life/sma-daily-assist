"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"patient" | "caregiver">("patient");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // 1️⃣ Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        }
      );
      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Failed to create user");

      // 2️⃣ Insert profile
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          full_name: fullName,
          role,
        },
      ]);
      if (profileError) throw profileError;

      // 3️⃣ Redirect
      router.push("/auth/sign-up-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join SMA Daily Assist</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="flex flex-col gap-6">
              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <RadioGroup
                value={role}
                onValueChange={(value) =>
                  setRole(value as "patient" | "caregiver")
                }
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient">Patient</Label>
                  <RadioGroupItem value="caregiver" id="caregiver" />
                  <Label htmlFor="caregiver">Caregiver</Label>
                </div>
              </RadioGroup>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                placeholder="Repeat Password"
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
              {error && <p className="text-destructive">{error}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Sign Up"}
              </Button>
              <Link
                href="/auth/login"
                className="underline text-sm text-center"
              >
                Already have an account? Login
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
