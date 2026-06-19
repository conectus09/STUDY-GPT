import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { CookiesContent } from "@/components/legal/cookies-content";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Cookie Policy — ${APP_NAME}`,
  description: `How ${APP_NAME} uses cookies, local storage, and how you can manage your preferences.`,
};

export default function CookiesPage() {
  return (
    <InfoPage
      active="cookies"
      title="Cookie Policy"
      description={`How ${APP_NAME} uses cookies and similar technologies.`}
    >
      <CookiesContent />
    </InfoPage>
  );
}