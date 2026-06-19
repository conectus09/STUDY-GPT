import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { PrivacyContent } from "@/components/legal/privacy-content";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy — ${APP_NAME}`,
  description: `How ${APP_NAME} collects, uses, stores, and protects your personal information.`,
};

export default function PrivacyPage() {
  return (
    <InfoPage
      active="privacy"
      title="Privacy Policy"
      description={`How ${APP_NAME} handles your information.`}
    >
      <PrivacyContent />
    </InfoPage>
  );
}