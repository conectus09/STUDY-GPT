import { ArrowRight } from "lucide-react";
import { LandingChatPreview } from "@/components/landing-chat-preview";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StartChatButton } from "@/components/start-chat-button";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="theme-glow-1 absolute -left-32 top-20 h-96 w-96 rounded-full blur-3xl" />
        <div className="theme-glow-2 absolute -right-32 bottom-20 h-96 w-96 rounded-full blur-3xl" />
        <div className="theme-glow-3 absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <SiteHeader />

      <section className="relative z-10 flex flex-1 items-center px-4 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:translate-x-4 xl:translate-x-6">
            <Logo size="xl" href="" showName={false} className="mb-4 justify-center sm:mb-6 lg:justify-start" />

            <h1 className="theme-headline mb-3 text-4xl font-black tracking-tight sm:mb-4 sm:text-5xl md:text-7xl">
              {APP_NAME}
            </h1>

            <p className="mb-8 max-w-xl text-base text-muted sm:mb-10 sm:text-lg md:text-xl">
              {APP_TAGLINE}
            </p>

            <StartChatButton size="lg" className="group gap-3 px-10 text-lg">
              Start Chatting
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </StartChatButton>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LandingChatPreview />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}