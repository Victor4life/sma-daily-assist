"use client";

import { Bell, Menu, User, HeartPulse, Pill, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen flex overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/notebook-bg.png"
          alt="Notebook Texture"
          fill
          className="object-cover opacity-[0.4]"
        />
      </div>

      {/* Color overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-blue-50/70 backdrop-blur-xl -z-10"></div>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-indigo-100 relative">
        <div className="p-8 border-b">
          <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
            SMA Assist
          </h1>
          <p className="text-sm text-gray-500 mt-1">Health Companion</p>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {[
            { icon: User, label: "Overview" },
            { icon: HeartPulse, label: "Health Logs" },
            { icon: Pill, label: "Medication" },
            { icon: Stethoscope, label: "Caregiver Tools" },
          ].map((item, i) => (
            <button
              key={i}
              className="group w-full flex items-center gap-4 p-4 rounded-2xl 
                         hover:bg-indigo-100/40 transition-all border border-transparent 
                         hover:border-indigo-200"
            >
              <item.icon
                size={20}
                className="text-indigo-600 group-hover:scale-110 transition"
              />
              <span className="text-gray-700 font-medium group-hover:text-indigo-700">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t">
          <Button
            variant="outline"
            className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Top Navbar */}
        <header className="w-full p-4 bg-white/80 backdrop-blur-lg shadow-md flex justify-between items-center md:hidden">
          <Menu className="text-gray-700" />
          <h2 className="font-semibold text-gray-800">Dashboard</h2>
          <Bell className="text-gray-700" />
        </header>

        {/* Hero Section */}
        <div className="p-8">
          <div className="bg-white/80 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-3xl p-10 animate-fade-in">
            <h2 className="text-4xl font-extrabold text-gray-800">
              Welcome Back 👋
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              Here’s your personalized health overview for today.
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up">
          {[
            "Profile Overview",
            "Daily Logs",
            "Medication",
            "Caregiver Notes",
            "Appointments",
            "Alerts & Notifications",
          ].map((title, i) => (
            <div
              key={i}
              className="p-6 bg-white/70 backdrop-blur-xl border border-indigo-100 
                         shadow-lg rounded-3xl hover:shadow-2xl transition-all transform 
                         hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
              <p className="text-gray-600">
                {title === "Profile Overview" &&
                  "Your personal health information summary."}
                {title === "Daily Logs" &&
                  "Track symptoms, moods, and daily activity."}
                {title === "Medication" &&
                  "Your reminders and dosage schedule."}
                {title === "Caregiver Notes" &&
                  "Updates and notes from caregivers."}
                {title === "Appointments" &&
                  "Upcoming consultations and sessions."}
                {title === "Alerts & Notifications" &&
                  "Important health updates appear here."}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 p-6 text-center text-gray-500 font-medium">
          SMA Daily Assist © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
