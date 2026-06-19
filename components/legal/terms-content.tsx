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

export function TermsContent() {
  return (
    <>
      <LegalUpdated date={LEGAL_LAST_UPDATED} />

      <LegalSection title="1. Agreement to Terms">
        <p>
          These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement
          between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and {APP_NAME}
          (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) governing your access to and
          use of the {APP_NAME} website, applications, and all related services
          (collectively, the &quot;Service&quot;).
        </p>
        <p>
          By accessing, browsing, or using the Service in any manner — including clicking
          &quot;Start Chatting&quot;, entering a chat room, or creating a session — you
          acknowledge that you have read, understood, and agree to be bound by these Terms
          and our{" "}
          <LegalLink href="/privacy">Privacy Policy</LegalLink>,{" "}
          <LegalLink href="/cookies">Cookie Policy</LegalLink>, and all applicable laws
          and regulations.
        </p>
        <p>
          If you do not agree to these Terms, you must immediately discontinue use of the
          Service.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility & Age Requirements">
        <p>
          The Service is intended exclusively for individuals who are{" "}
          <strong>18 years of age or older</strong>. By using {APP_NAME}, you represent and
          warrant that:
        </p>
        <LegalList
          items={[
            "You are at least 18 years old",
            "You have the legal capacity to enter into a binding agreement",
            "You are not prohibited from using the Service under any applicable law",
            "You will provide truthful information during the start gate (name, age confirmation)",
            "You will not permit any minor to access or use the Service through your device or connection",
          ]}
        />
        <p>
          We reserve the right to request proof of age at any time and to immediately
          terminate access for any user we reasonably believe is under 18.
        </p>
      </LegalSection>

      <LegalSection title="3. Description of Service">
        <p>
          {APP_NAME} is a random video, voice, and text chat platform that pairs users with
          strangers for real-time conversations. The Service includes, but is not limited to:
        </p>
        <LegalList
          items={[
            "Random user matching and queue management",
            "Real-time video, voice, and text communication via third-party infrastructure",
            "Session-based chat rooms with skip/next functionality",
            "User reporting and moderation tools",
            "Theme preferences and session state management",
            "Optional account features (login/signup when available)",
          ]}
        />
        <p>
          We do not guarantee continuous availability, match quality, or that you will be
          paired with any particular type of user. The Service is provided on a best-effort
          basis.
        </p>
      </LegalSection>

      <LegalSection title="4. User Conduct & Community Rules">
        <p>
          You agree to use {APP_NAME} responsibly and respectfully. All users must comply
          with the following community standards at all times:
        </p>

        <LegalSubsection title="4.1 Respectful Behaviour">
          <LegalList
            items={[
              "Treat all users with dignity and respect regardless of background, identity, or beliefs",
              "Accept that users may end a chat at any time without explanation",
              "Do not pressure others to share personal information, images, or engage in unwanted activities",
              "Use appropriate language and avoid aggressive or threatening behaviour",
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="4.2 Strictly Prohibited Conduct">
          <LegalList
            items={[
              "Harassment, bullying, stalking, or repeated unwanted contact",
              "Hate speech, discrimination, or content targeting race, religion, gender, sexuality, disability, or nationality",
              "Sexual harassment, unsolicited sexual content, or explicit nudity",
              "Sharing, requesting, or distributing child sexual abuse material (CSAM) — zero tolerance, immediate report to authorities",
              "Violence, threats of harm, or encouragement of self-harm or suicide",
              "Illegal activity including drug trafficking, fraud, money laundering, or terrorism",
              `Impersonation of any person, entity, or ${APP_NAME} staff member`,
              "Recording, screenshotting, or distributing another user's video, voice, or messages without their explicit consent",
              "Doxxing — sharing another person's private information (address, phone, workplace, etc.)",
              "Spam, advertising, phishing, or promotion of third-party services without authorisation",
              "Use of bots, scripts, automation tools, or artificial traffic to manipulate the Service",
              "Circumventing bans, blocks, age gates, or security measures",
              "Reverse engineering, scraping, or unauthorised access to our systems or APIs",
            ]}
          />
        </LegalSubsection>
      </LegalSection>

      <LegalSection title="5. Video, Voice & Text Chat Rules">
        <LegalList
          items={[
            "You are solely responsible for all content you transmit via video, audio, or text",
            "Do not display illegal, obscene, or harmful content on camera or in messages",
            "Do not use the Service while driving or operating machinery",
            "Ensure you have consent before showing other people in your video feed",
            "Do not use the Service in locations where video chat is prohibited by law or policy",
            "Report any user who violates these rules using the in-chat report feature or Contact page",
            "We may monitor reports and take action but are not obligated to review all content in real time",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Account, Sessions & Identity">
        <p>
          {APP_NAME} may operate with session-based anonymous identifiers. When account
          features are available, you agree to:
        </p>
        <LegalList
          items={[
            "Maintain the confidentiality of your login credentials",
            "Notify us immediately of any unauthorised access to your account",
            "Not share your account with others",
            "Not create multiple accounts to evade bans or restrictions",
            "Accept that we may suspend or delete accounts that violate these Terms",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Intellectual Property">
        <p>
          All content, trademarks, logos, software, design, and branding on {APP_NAME} are
          owned by or licensed to us and protected by applicable intellectual property laws.
          You may not copy, modify, distribute, sell, or create derivative works without
          our written permission.
        </p>
        <p>
          You retain ownership of content you create, but grant us a non-exclusive,
          worldwide, royalty-free licence to use, process, and transmit your content solely
          as necessary to operate the Service.
        </p>
      </LegalSection>

      <LegalSection title="8. Third-Party Services">
        <p>
          The Service relies on third-party providers including real-time communication
          infrastructure (e.g. LiveKit), hosting, and data storage. Your use of those
          services may be subject to their own terms. We are not responsible for
          third-party outages, failures, or policies.
        </p>
      </LegalSection>

      <LegalSection title="9. Reporting, Moderation & Enforcement">
        <p>We reserve the right, at our sole discretion, to:</p>
        <LegalList
          items={[
            "Investigate reports of Terms violations",
            "Issue warnings, temporary suspensions, or permanent bans",
            "Terminate active chat sessions without notice",
            "Cooperate with law enforcement where required by law",
            "Remove or restrict access to any content or user",
          ]}
        />
        <p>
          Enforcement decisions are final. We are not obligated to provide advance notice
          before taking action against violators.
        </p>
      </LegalSection>

      <LegalSection title="10. Disclaimers">
        <p>
          THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS
          WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
          LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          NON-INFRINGEMENT, OR UNINTERRUPTED SERVICE.
        </p>
        <p>We do not warrant that:</p>
        <LegalList
          items={[
            "The Service will be error-free or uninterrupted",
            "Other users will behave appropriately or lawfully",
            "Matches will be available at all times",
            "Your communications will be completely private or secure from all third parties",
          ]}
        />
      </LegalSection>

      <LegalSection title="11. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, {APP_NAME} AND ITS OPERATORS,
          DIRECTORS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF
          PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING FROM:
        </p>
        <LegalList
          items={[
            "Your use of or inability to use the Service",
            "Conduct or content of other users",
            "Unauthorised access to your transmissions or data",
            "Any interruption, suspension, or termination of the Service",
          ]}
        />
        <p>
          Our total liability for any claim shall not exceed the amount you paid us (if any)
          in the twelve (12) months preceding the claim, or INR 1,000, whichever is greater.
        </p>
      </LegalSection>

      <LegalSection title="12. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless {APP_NAME} and its operators
          from any claims, damages, losses, liabilities, and expenses (including legal fees)
          arising from your use of the Service, your violation of these Terms, or your
          violation of any third-party rights.
        </p>
      </LegalSection>

      <LegalSection title="13. Termination">
        <p>
          You may stop using the Service at any time. We may suspend or terminate your access
          immediately, without prior notice, for any violation of these Terms or for any
          other reason at our discretion. Upon termination, your right to use the Service
          ceases immediately.
        </p>
      </LegalSection>

      <LegalSection title="14. Governing Law & Disputes">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of
          India, without regard to conflict of law principles. Any disputes arising from
          these Terms or the Service shall be subject to the exclusive jurisdiction of the
          courts located in India.
        </p>
        <p>
          Before initiating formal proceedings, you agree to contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="legal-link">
            {CONTACT_EMAIL}
          </a>{" "}
          or {CONTACT_PHONE} to attempt informal resolution within thirty (30) days.
        </p>
      </LegalSection>

      <LegalSection title="15. Changes to Terms">
        <p>
          We may revise these Terms at any time. Material changes will be reflected by
          updating the &quot;Last updated&quot; date. Continued use of the Service after
          changes constitutes acceptance. We encourage you to review these Terms
          periodically.
        </p>
      </LegalSection>

      <LegalSection title="16. Contact">
        <p>For questions regarding these Terms, contact us:</p>
        <LegalList
          items={[
            `Email: ${CONTACT_EMAIL}`,
            `Phone: ${CONTACT_PHONE}`,
            "Contact page: /contact",
          ]}
        />
      </LegalSection>
    </>
  );
}