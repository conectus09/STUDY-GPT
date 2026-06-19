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

export function CookiesContent() {
  return (
    <>
      <LegalUpdated date={LEGAL_LAST_UPDATED} />

      <LegalSection title="1. What Are Cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a website.
          Similar technologies include local storage, session storage, and pixels. This
          Cookie Policy explains how {APP_NAME} uses these technologies and how you can
          control them.
        </p>
        <p>
          This policy should be read alongside our{" "}
          <LegalLink href="/privacy">Privacy Policy</LegalLink> and{" "}
          <LegalLink href="/terms">Terms of Service</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection title="2. How We Use Cookies & Storage">
        <p>
          {APP_NAME} uses cookies and browser storage to keep the Service working, remember
          your preferences, and (only with your consent) support optional analytics in the
          future. We do <strong>not</strong> use advertising or tracking cookies from
          third-party ad networks.
        </p>
      </LegalSection>

      <LegalSection title="3. Types of Cookies We Use">
        <LegalSubsection title="3.1 Strictly Necessary (Essential)">
          <p>
            These are required for the Service to function. They cannot be disabled through
            our cookie banner without breaking core features.
          </p>
          <LegalList
            items={[
              "Session identifiers for matching and chat rooms",
              "Security and abuse-prevention tokens",
              "Load balancing and connection stability",
              "Cookie consent preference storage (chinwag-cookie-consent)",
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="3.2 Functional (Preferences)">
          <p>
            These remember choices you make to improve your experience. You may disable
            these via our cookie settings or by choosing &quot;Essential Only&quot; in the
            consent banner.
          </p>
          <LegalList
            items={[
              "Theme preference (chinwag-theme) — dark, light, ocean, etc.",
              "Theme version flag (chinwag-theme-version)",
              "Start gate completion state",
              "User profile display name (local session)",
              "Auth session state (when login is available)",
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="3.3 Analytics (Optional — Future)">
          <p>
            We currently do <strong>not</strong> deploy third-party analytics cookies. If we
            introduce privacy-respecting analytics in the future, they will only be activated
            with your explicit consent via the cookie banner. You will be able to opt out at
            any time.
          </p>
        </LegalSubsection>
      </LegalSection>

      <LegalSection title="4. Cookie & Storage Table">
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Name / Key</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>chinwag-cookie-consent</td>
                <td>Essential</td>
                <td>Stores your cookie consent choice</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>chinwag-theme</td>
                <td>Functional</td>
                <td>Remembers your selected colour theme</td>
                <td>Persistent</td>
              </tr>
              <tr>
                <td>chinwag-theme-version</td>
                <td>Functional</td>
                <td>Ensures theme defaults stay current</td>
                <td>Persistent</td>
              </tr>
              <tr>
                <td>Session / user ID</td>
                <td>Essential</td>
                <td>Anonymous identifier for matching</td>
                <td>Session / 1 hour</td>
              </tr>
              <tr>
                <td>Start gate profile</td>
                <td>Functional</td>
                <td>Remembers name and gate completion</td>
                <td>Session / local</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="5. Third-Party Cookies">
        <p>
          Real-time video and voice chat may involve third-party infrastructure providers
          (e.g. LiveKit) that set their own technical cookies or use WebRTC data channels.
          These are necessary for communication functionality. We do not control
          third-party cookie policies — refer to their documentation for details.
        </p>
      </LegalSection>

      <LegalSection title="6. Managing Your Cookie Preferences">
        <LegalSubsection title="6.1 Cookie Consent Banner">
          <p>
            When you first visit {APP_NAME}, a cookie consent banner appears at the bottom
            of the screen. You can choose:
          </p>
          <LegalList
            items={[
              "Accept All — enables essential and functional cookies (and analytics if available)",
              "Essential Only — only strictly necessary cookies; theme and preferences may reset",
              "Customize — choose functional and analytics categories individually",
            ]}
          />
        </LegalSubsection>

        <LegalSubsection title="6.2 Browser Settings">
          <p>
            You can also block or delete cookies through your browser settings. Note that
            blocking essential cookies may prevent the Service from working correctly.
          </p>
        </LegalSubsection>

        <LegalSubsection title="6.3 Changing Your Mind">
          <p>
            To update your preferences later, clear the &quot;chinwag-cookie-consent&quot;
            entry from your browser&apos;s local storage and refresh the page — the consent
            banner will reappear. You may also contact us for assistance.
          </p>
        </LegalSubsection>
      </LegalSection>

      <LegalSection title="7. Legal Basis">
        <p>
          Essential cookies are used based on legitimate interest and contractual necessity
          (providing the Service). Functional and analytics cookies require your consent
          under applicable laws including the EU ePrivacy Directive, UK PECR, and India's
          DPDP Act where applicable.
        </p>
      </LegalSection>

      <LegalSection title="8. Updates to This Policy">
        <p>
          We may update this Cookie Policy when we add new features or change our use of
          cookies. Check the &quot;Last updated&quot; date above. Continued use after
          changes constitutes acceptance where permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p>Questions about cookies or this policy?</p>
        <LegalList
          items={[
            `Email: ${CONTACT_EMAIL}`,
            `Phone: ${CONTACT_PHONE}`,
          ]}
        />
        <p>
          <LegalLink href="/contact">Contact page</LegalLink>
        </p>
      </LegalSection>
    </>
  );
}