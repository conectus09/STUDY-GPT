"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

const STORAGE_KEY = "chinwag-user-id";

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) {
      setUserId(existing);
      return;
    }

    const id = nanoid(16);
    sessionStorage.setItem(STORAGE_KEY, id);
    setUserId(id);
  }, []);

  return userId;
}