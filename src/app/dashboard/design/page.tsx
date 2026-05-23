import type { Metadata } from "next";
import { DesignDashboard } from "@/components/settings/DesignDashboard";

export const metadata: Metadata = {
  title: "Design Settings | Azadi Coffee",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSettingsPage() {
  return <DesignDashboard />;
}

