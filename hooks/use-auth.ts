"use client";

import { useSyncExternalStore } from "react";
import { readAuthLoggedIn, subscribeAuth } from "@/lib/auth-session";

export function useAuth() {
  const isLoggedIn = useSyncExternalStore(
    subscribeAuth,
    readAuthLoggedIn,
    () => false,
  );

  return { isLoggedIn };
}