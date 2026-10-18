"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMeAction } from "@/features/user/actions";
import { Profile } from "@/features/user/type";

type Status = "loading" | "authenticated" | "unauthenticated";

type UserContext = {
  user: Profile | null;
  status: Status;
  refresh: () => Promise<Profile | null>;
  setUser: (user: Profile) => void;
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

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ user: Profile | null; status: Status }>({ user: null, status: "loading" });

  const refresh = useCallback(async () => {
    const user = await fetchMe();
    setState({ user, status: user ? "authenticated" : "unauthenticated" });
    return user;
  }, []);

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
