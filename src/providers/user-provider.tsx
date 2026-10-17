"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMeAction } from "@/features/user/actions";
import { Profile } from "@/features/user/type";
// import type { Profile } from "@/features/user/profile";

type Status = "loading" | "authenticated" | "unauthenticated";

type UserContext = {
  user: Profile | null;
  status: Status;
  /** /auth/me আবার ডাকে। login এর পর call করো। */
  refresh: () => Promise<Profile | null>;
  /** Profile update এর পর নতুন data বসাতে। */
  setUser: (user: Profile) => void;
  /** Logout এর সময়। */
  clear: () => void;
};

const Ctx = createContext<UserContext | null>(null);

async function fetchMe(): Promise<Profile | null> {
  try {
    const res = await getMeAction();
    return res.success ? (res.user ?? null) : null;
  } catch {
    return null;
  }
}

/** পুরো app কে wrap করে। Page খুললে একবার /auth/me ডেকে logged-in user কে সবার জন্য ধরে রাখে। */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ user: Profile | null; status: Status }>({ user: null, status: "loading" });

  const refresh = useCallback(async () => {
    const user = await fetchMe();
    setState({ user, status: user ? "authenticated" : "unauthenticated" });
    return user;
  }, []);

  // Page খুললে একবার। setState টা fetch এর callback এ, তাই effect এর ভেতরে সরাসরি নয়।
  useEffect(() => {
    let alive = true;
    fetchMe().then((user) => {
      if (alive) setState({ user, status: user ? "authenticated" : "unauthenticated" });
    });
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo<UserContext>(
    () => ({
      ...state,
      refresh,
      setUser: (user) => setState({ user, status: "authenticated" }),
      clear: () => setState({ user: null, status: "unauthenticated" }),
    }),
    [state, refresh],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
