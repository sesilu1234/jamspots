"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({
    children,
    session, // Add this prop
}: {
    children: React.ReactNode;
    session: any; // Add to type
}) {
    // 3. Hand the session to the Provider
    return <SessionProvider session={session}>{children}</SessionProvider>;
}