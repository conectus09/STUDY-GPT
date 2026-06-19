import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { TermsContent } from "@/components/legal/terms-content";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Terms of Service — ${APP_NAME}`,
  description: `Rules, regulations, and guidelines for using ${APP_NAME}.`,
};

export default function TermsPage() {
  return (
    <InfoPage
      active="terms"
      title="Terms of Service"
      description={`Rules and guidelines for using ${APP_NAME}.`}
    >
      <TermsContent />
    </InfoPage>
  );
}