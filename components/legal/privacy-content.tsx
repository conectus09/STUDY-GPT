import {
  APP_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  LEGAL_LAST_UPDATED,
} from "@/lib/constants";
import {
  LegalLink,
  LegalList,
  LegalSection,
  LegalSubsection,
  LegalUpdated,
} from "./legal-prose";

export function PrivacyContent() {
  return (
    <>
      <LegalUpdated date={LEGAL_LAST_UPDATED} />

      <LegalSection title="1. Introduction">
        <p>
          This Privacy Policy explains how {APP_NAME} (&quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) collects, uses, stores, shares, and protects your information
          when you use our website and random video chat services (the &quot;Service&quot;).
        </p>
        <p>
          By using {APP_NAME}, you consent to the practices described in this policy. Please
          also read our{" "}
          <LegalLink href="/terms">Terms of Service</LegalLink> and{" "}
          <LegalLink href="/cookies">Cookie Policy</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <LegalSubsection title="2.1 Information You Provide">
          <LegalList
            items={[
              "Display name entered at the start gate",
              "Age confirmation (self-declared, 18+)",
              "Email and password (when account features are used)",
              "Captcha verification input",
              "Communications you send to our support team",
              "Report submissions including reason and session context",
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="2.2 Automatically Collected Information">
          <LegalList
            items={[
              "Session identifiers and anonymous user IDs",
              "Match queue status, room IDs, and partner session references",
              "Device type, browser type, operating system, and language",
              "IP address and approximate geographic region",
              "Connection quality metrics for video/voice chat",
              "Timestamps of session activity",
              "Theme and UI preferences stored locally",
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="2.3 Chat & Communication Data">
          <p>
            Video, voice, and text communications are transmitted in real time through
            third-party infrastructure. We design our Service so that conversation content
            is <strong>not permanently stored</strong> on our servers. However, metadata
            about sessions (duration, room ID, participant IDs) may be temporarily retained
            for matching, moderation, and technical operations.
          </p>
        </LegalSubsection>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use collected information for the following purposes:</p>
        <LegalList
          items={[
            "Matching you with other users for chat sessions",
            "Operating and maintaining the Service",
            "Authenticating sessions and preventing abuse",
            "Processing reports and enforcing community guidelines",
            "Responding to support requests and legal inquiries",
            "Improving Service performance and reliability",
            "Complying with legal obligations and law enforcement requests",
            "Protecting the safety and security of users and the platform",
          ]}
        />
        <p>
          We do <strong>not</strong> sell your personal information to third parties. We do
          not use your data for third-party advertising profiling.
        </p>
      </LegalSection>

      <LegalSection title="4. Legal Basis for Processing">
        <p>Depending on your jurisdiction, we process data based on:</p>
        <LegalList
          items={[
            "Your consent (e.g. age confirmation, cookie preferences, account registration)",
            "Performance of a contract (providing the chat service you request)",
            "Legitimate interests (fraud prevention, security, service improvement)",
            "Legal obligation (responding to lawful government or court requests)",
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Data Sharing & Disclosure">
        <p>We may share information only in the following circumstances:</p>
        <LegalList
          items={[
            "Service providers: hosting, real-time communication (LiveKit), and infrastructure partners who process data on our behalf under contractual obligations",
            "Legal requirements: when required by law, court order, or government authority",
            `Safety: to protect the rights, property, or safety of ${APP_NAME}, our users, or the public`,
            "Business transfers: in connection with a merger, acquisition, or sale of assets (with notice where required)",
          ]}
        />
        <p>We do not share personal data with advertisers or data brokers.</p>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <LegalList
          items={[
            "Session and match data: retained temporarily (typically up to 1 hour) for queue management, then deleted or anonymised",
            "Report data: retained as long as necessary to investigate and prevent repeat abuse",
            "Support communications: retained for up to 2 years unless longer retention is required by law",
            "Account data (when applicable): retained until account deletion request or 2 years of inactivity",
            "Server logs: retained for up to 90 days for security and debugging",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Data Security">
        <p>
          We implement reasonable technical and organisational measures to protect your
          information, including encrypted connections (HTTPS/WSS), access controls, and
          secure session handling. However, no method of transmission over the internet is
          100% secure. You use the Service at your own risk.
        </p>
      </LegalSection>

      <LegalSection title="8. International Data Transfers">
        <p>
          Your data may be processed on servers located outside your country of residence,
          including through third-party providers. Where required, we take steps to ensure
          appropriate safeguards for cross-border transfers.
        </p>
      </LegalSection>

      <LegalSection title="9. Children's Privacy">
        <p>
          {APP_NAME} is <strong>not intended for anyone under 18</strong>. We do not
          knowingly collect personal information from minors. If we discover that a minor
          has used the Service, we will terminate their session and delete associated data
          promptly. Parents or guardians who believe a minor has used {APP_NAME} should
          contact us immediately.
        </p>
      </LegalSection>

      <LegalSection title="10. Your Rights">
        <p>Depending on applicable law (including India's DPDP Act where applicable), you may have the right to:</p>
        <LegalList
          items={[
            "Access the personal data we hold about you",
            "Request correction of inaccurate data",
            "Request deletion of your data (subject to legal retention requirements)",
            "Withdraw consent for optional processing (e.g. functional cookies)",
            "Object to certain processing based on legitimate interests",
            "Lodge a complaint with a relevant data protection authority",
          ]}
        />
        <p>
          To exercise these rights, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="legal-link">
            {CONTACT_EMAIL}
          </a>{" "}
          or {CONTACT_PHONE}. We will respond within 30 days where required by law.
        </p>
      </LegalSection>

      <LegalSection title="11. Cookies & Local Storage">
        <p>
          We use browser local storage and essential session technologies. For full details,
          see our <LegalLink href="/cookies">Cookie Policy</LegalLink>. You can manage
          cookie preferences through our cookie consent banner or browser settings.
        </p>
      </LegalSection>

      <LegalSection title="12. Third-Party Links">
        <p>
          Our Service may contain links to third-party websites (e.g. social media). We are
          not responsible for the privacy practices of those sites. Review their policies
          before providing any information.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot;
          date at the top reflects the most recent revision. Material changes may be
          communicated through the Service. Continued use after changes constitutes
          acceptance.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact Us">
        <p>For privacy-related questions, requests, or complaints:</p>
        <LegalList
          items={[
            `Email: ${CONTACT_EMAIL}`,
            `Phone: ${CONTACT_PHONE}`,
          ]}
        />
        <p>
          Or visit our <LegalLink href="/contact">Contact page</LegalLink>.
        </p>
      </LegalSection>
    </>
  );
}