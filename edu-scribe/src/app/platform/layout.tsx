import React from "react";
import PlatformSidebar from "@/app/components/PlatformSidebar";
import CurrentUserProvider from "../currentUserProvider";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <CurrentUserProvider>
        <PlatformSidebar>{children}</PlatformSidebar>
      </CurrentUserProvider>
    </main>
  );
}
