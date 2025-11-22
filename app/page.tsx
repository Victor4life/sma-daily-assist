import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, MessageSquare, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            SMA Daily Assist
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 max-w-6xl mx-auto px-4 py-20 md:py-28 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl font-bold text-balance">
                Simple support for SMA patients
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Connect with your caregivers with one tap. Get help faster. Stay
                independent. Designed for accessibility.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/sign-up?role=patient">
                <Button size="lg" className="rounded-full">
                  I&apos;m a Patient
                </Button>
              </Link>
              <Link href="/auth/sign-up?role=caregiver">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent"
                >
                  I&apos;m a Caregiver
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-24 h-24 mx-auto text-primary/40 mb-4" />
              <p className="text-muted-foreground">
                Patient &amp; Caregiver Connection
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything you need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">One-Tap Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom buttons for quick requests to caregivers
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Real-Time Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant messaging with your care team
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Easy Linking</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with caregivers using 6-digit codes
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Accessibility First</h3>
                  <p className="text-sm text-muted-foreground">
                    Designed for users with mobility challenges
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12 text-center flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to get started?
              </h2>
              <p className="text-lg opacity-95 max-w-2xl mx-auto">
                Join thousands of SMA patients and caregivers already using SMA
                Daily Assist
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/auth/sign-up?role=patient">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full"
                  >
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2025 SMA Daily Assist. Designed for accessibility and
            simplicity.
          </p>
        </div>
      </footer>
    </div>
  );
}
