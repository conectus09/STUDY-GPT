import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { AboutContent } from "@/components/legal/about-content";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About — ${APP_NAME}`,
  description: `Learn more about ${APP_NAME} — our mission, features, and commitment to safe random video chat.`,
};

export default function AboutPage() {
  return (
    <InfoPage
      active="about"
      title="About"
      description={`Learn more about ${APP_NAME} and what we do.`}
    >
      <AboutContent />
    </InfoPage>
  );
}