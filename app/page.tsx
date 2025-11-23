import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Users,
  MessageSquare,
  Settings,
  Heart,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary flex items-center gap-3">
            <img
              src="/logo-sma.png"
              alt=""
              className="w-12 h-12 rounded-2xl bg-grey-100"
            />
            <p className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SMA Assist
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" className="rounded-full">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 max-w-6xl mx-auto px-4 py-16 md:py-18 w-full">
        <div className="relative grid md:grid-cols-2 gap-12 items-center mb-16 overflow-hidden">
          <div className="flex flex-col gap-8 z-10">
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                Simple support for{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  SMA patients
                </span>
              </h1>{" "}
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in-up-delay-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow border-2 border-background" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary border-2 border-background" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-glow to-primary border-2 border-background" />
              </div>
              <span>Trusted by 5,000+ users across the globe</span>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative z-10 animate-fade-in-up-delay-2">
            <div className="relative">
              {/* Main image container */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-background">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 mix-blend-overlay" />
                <img
                  src="/image.png"
                  alt="Diverse community of people supporting each other in a caring environment"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />

                {/* Floating stat cards */}
                <div className="absolute top-8 left-8 bg-background/95 backdrop-blur-md rounded-2xl p-4 shadow-elegant border border-border animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">
                        24/7
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Always Available
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute bottom-8 right-8 bg-background/95 backdrop-blur-md rounded-2xl p-4 shadow-elegant border border-border animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">
                        98%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Satisfaction Rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything you{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              need{" "}
            </span>
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
