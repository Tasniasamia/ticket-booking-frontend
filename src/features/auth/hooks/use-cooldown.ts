"use client";

import { useSyncExternalStore } from "react";



const OTP_COOLDOWN_SEC = 120;
const UNKNOWN = -1; // server render / hydration এর সময়, localStorage এখনো পড়া হয়নি

const keyOf = (email: string, reason: string) => `otp_cd:${reason}:${email.trim().toLowerCase()}`;

function secondsLeft(key: string) {
  try {
    const at = Number(localStorage.getItem(key));
    return at ? Math.max(0, Math.ceil((at - Date.now()) / 1000)) : 0;
  } catch {
    return 0;
  }
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  const id = setInterval(cb, 1000); // প্রতি সেকেন্ডে snapshot আবার পড়ে
  window.addEventListener("storage", cb); // অন্য tab এ বদলালে
  return () => {
    listeners.delete(cb);
    clearInterval(id);
    window.removeEventListener("storage", cb);
  };
}

/** OTP পাঠানোর ঠিক পরে call করো। onlyIfIdle=true হলে চলমান timer থাকলে ছুঁবে না। */
export function startOtpCooldown(email: string, reason: string, seconds = OTP_COOLDOWN_SEC, onlyIfIdle = false) {
  const key = keyOf(email, reason);
  try {
    if (onlyIfIdle && secondsLeft(key) > 0) return;
    localStorage.setItem(key, String(Date.now() + seconds * 1000));
  } catch {}
  emit();
}

export function clearOtpCooldown(email: string, reason: string) {
  try {
    localStorage.removeItem(keyOf(email, reason));
  } catch {}
  emit();
}

export function useCooldown(email: string, reason: string) {
  const key = keyOf(email, reason);
  const left = useSyncExternalStore(subscribe, () => secondsLeft(key), () => UNKNOWN);
  const restart = (seconds = OTP_COOLDOWN_SEC) => startOtpCooldown(email, reason, seconds);
  return [left, restart] as const;
}
