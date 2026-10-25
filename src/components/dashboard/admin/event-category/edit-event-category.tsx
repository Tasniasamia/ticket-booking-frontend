"use client";

import { useEffect, useState } from "react";
import { getEventCategoryByIdAction } from "@/features/event-category/actions";
import type { EventCategory } from "@/features/event-category/types";
import type { Language } from "@/features/language/types";
import { EventCategoryForm } from "./event-category-form";

type Props = {
  id: number;
  languages: Language[];
  onSuccess: () => void;
};

/** Edit চাপলে lang ছাড়া GET /:id ডাকে, তাই সব language এর data এসে form ভরে। */
export function EditEventCategory({ id, languages, onSuccess }: Props) {
  const [data, setData] = useState<EventCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getEventCategoryByIdAction(id).then((res) => {
      if (!alive) return;
      if (res.success && res.eventCategory) setData(res.eventCategory);
      else setError(res.message ?? "Could not load.");
    });
    return () => {
      alive = false;
    };
  }, [id]);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data) return <p className="text-sm opacity-60">Loading...</p>;

  return <EventCategoryForm languages={languages} eventCategory={data} onSuccess={onSuccess} />;
}