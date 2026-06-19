import { APP_NAME } from "@/lib/constants";
import { LegalLink, LegalList, LegalSection, LegalSubsection } from "./legal-prose";

export function AboutContent() {
  return (
    <>
      <LegalSection title="Who We Are">
        <p>
          {APP_NAME} is a random video, voice, and text chat platform built for people who
          want to meet someone new — instantly, spontaneously, and from anywhere in the world.
        </p>
        <p>
          Whether you&apos;re looking for a quick conversation, want to practice a language,
          or simply enjoy talking to strangers, {APP_NAME} connects you in seconds through
          our real-time matching system.
        </p>
      </LegalSection>

      <LegalSection title="What We Offer">
        <LegalList
          items={[
            "Instant random matching — no waiting lists or complicated setup",
            "Video chat, voice calls, and text messaging in one interface",
            "Skip to the next person anytime with one tap",
            "Multiple colour themes to personalise your experience",
            "Built-in reporting tools to flag inappropriate behaviour",
            "Age gate and community guidelines to keep chats safer",
          ]}
        />
      </LegalSection>

      <LegalSection title="Our Mission">
        <p>
          We believe technology should bring people together. In a world where social media
          often feels performative, {APP_NAME} is designed for genuine, unscripted human
          connection — a real chinwag with a real person, right now.
        </p>
      </LegalSection>

      <LegalSection title="Safety & Responsibility">
        <p>
          Safety is central to everything we build. All users must be 18 or older. We
          enforce community rules against harassment, illegal content, and abuse. Users can
          report violations, and we act on credible reports.
        </p>
        <p>
          Please read our full policies before using the Service:
        </p>
        <LegalList
          items={[
            "Terms of Service — rules and prohibited conduct",
            "Privacy Policy — how we handle your data",
            "Cookie Policy — how we use cookies and storage",
          ]}
        />
        <p>
          <LegalLink href="/terms">Terms</LegalLink>
          {" · "}
          <LegalLink href="/privacy">Privacy</LegalLink>
          {" · "}
          <LegalLink href="/cookies">Cookies</LegalLink>
        </p>
      </LegalSection>

      <LegalSubsection title="A Note on Responsible Use">
        <p>
          {APP_NAME} pairs you with strangers. Never share passwords, bank details, or
          personal addresses. End any chat that makes you uncomfortable. You are always in
          control.
        </p>
      </LegalSubsection>
    </>
  );
}