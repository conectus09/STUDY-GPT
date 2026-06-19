import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { LegalList, LegalSection } from "@/components/legal/legal-prose";
import {
  APP_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  LEGAL_LAST_UPDATED,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact — ${APP_NAME}`,
  description: `Get in touch with the ${APP_NAME} team for support, reports, and legal inquiries.`,
};

export default function ContactPage() {
  return (
    <InfoPage
      active="contact"
      title="Contact"
      description={`Get in touch with the ${APP_NAME} team.`}
    >
      <p className="legal-updated">Last updated: {LEGAL_LAST_UPDATED}</p>

      <LegalSection title="Get In Touch">
        <p>
          Have a question, feedback, privacy request, or need to report a problem?
          We&apos;d love to hear from you. Our team typically responds within{" "}
          <strong>1–2 business days</strong>.
        </p>
      </LegalSection>

      <div className="info-contact-cards">
        <a href={`mailto:${CONTACT_EMAIL}`} className="info-contact-card">
          <span className="info-contact-card-label">Email</span>
          <span className="info-contact-card-value">{CONTACT_EMAIL}</span>
        </a>
        <a href={CONTACT_PHONE_HREF} className="info-contact-card">
          <span className="info-contact-card-label">Phone</span>
          <span className="info-contact-card-value">{CONTACT_PHONE}</span>
        </a>
      </div>

      <LegalSection title="What We Can Help With">
        <LegalList
          items={[
            "Account and login questions",
            "Reporting abusive or inappropriate user behaviour",
            "Technical issues with video, voice, or text chat",
            "Privacy and data deletion requests",
            "Cookie preference assistance",
            "Terms of Service or legal inquiries",
            "Partnership and business enquiries",
            "General feedback and feature suggestions",
          ]}
        />
      </LegalSection>

      <LegalSection title="Before You Contact Us">
        <p>
          Many questions are answered in our legal pages. Please review them first
          for faster resolution:
        </p>
        <LegalList
          items={[
            "Terms of Service — community rules and prohibited conduct",
            "Privacy Policy — data collection, retention, and your rights",
            "Cookie Policy — cookie types and how to manage preferences",
            "About — overview of the platform and safety practices",
          ]}
        />
        <p>
          <Link href="/terms" className="legal-link">Terms</Link>
          {" · "}
          <Link href="/privacy" className="legal-link">Privacy</Link>
          {" · "}
          <Link href="/cookies" className="legal-link">Cookies</Link>
          {" · "}
          <Link href="/about" className="legal-link">About</Link>
        </p>
      </LegalSection>

      <LegalSection title="Reporting Abuse">
        <p>
          If you encounter harassment, illegal content, or any violation of our Terms
          during a chat, use the in-chat <strong>Report</strong> button immediately.
          For urgent matters, email us at {CONTACT_EMAIL} with as much detail as
          possible (date, time, nature of incident). We take all reports seriously
          and may cooperate with law enforcement where required.
        </p>
      </LegalSection>

      <LegalSection title="Legal & Privacy Requests">
        <p>
          For formal privacy requests (access, correction, deletion) under applicable
          data protection laws, email {CONTACT_EMAIL} with the subject line
          &quot;Privacy Request&quot;. We will verify your identity and respond within
          30 days where required by law.
        </p>
      </LegalSection>
    </InfoPage>
  );
}