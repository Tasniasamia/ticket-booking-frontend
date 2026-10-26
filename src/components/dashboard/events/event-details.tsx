import { textOf } from "@/lib/localized";
import type { EventItem } from "@/features/event/types";
import { EventStatusBadge } from "./event-status-badge";
import { LocalTime } from "./local-time";
import { Price } from "@/components/shared/price";

const nf = new Intl.NumberFormat("en-US");

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs text-fg/55">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-medium">{children}</dd>
    </div>
  );
}

/** View dialog এর ভেতরের অংশ। admin এ showManager দিলে manager এর তথ্যও আসে। */
export function EventDetails({
  event,
  lang,
  showManager,
}: {
  event: EventItem;
  lang: string;
  showManager?: boolean;
}) {
  const description = textOf(event.description, lang);

  return (
    <div className="space-y-5">
      {event.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.thumbnail.url}
          alt={textOf(event.title, lang)}
          className="aspect-video w-full rounded-2xl border border-fg/15 object-cover"
        />
      )}

      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <Row label="Status">
          <EventStatusBadge status={event.status} />
        </Row>
        <Row label="Category">
          {event.category ? textOf(event.category.name, lang) : "—"}
        </Row>
        <Row label="Location">{textOf(event.location, lang)}</Row>
        <Row label="Starts at">
          <LocalTime iso={event.starts_at} />
        </Row>
        <Row label="Price">
          <Price amount={event.price} from={event.currency} />
        </Row>
        <Row label="Tickets">
          {nf.format(event.available_tickets)} available of{" "}
          {nf.format(event.total_tickets)}
        </Row>
        {showManager && (
          <Row label="Manager">
            {event.manager ? (
              <>
                {event.manager.name}
                <span className="block text-xs font-normal text-fg/60">
                  {event.manager.email}
                </span>
              </>
            ) : (
              "—"
            )}
          </Row>
        )}
        <Row label="Submitted">
          <LocalTime iso={event.created_at} />
        </Row>
      </dl>

      {description !== "—" && (
        <div>
          <p className="text-xs text-fg/55">Description</p>
          <p className="mt-0.5 whitespace-pre-line text-sm">{description}</p>
        </div>
      )}

      {event.images.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-fg/55">Gallery</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {event.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${img.id}-${img.url}`}
                src={img.url}
                alt=""
                className="aspect-square rounded-xl border border-fg/15 object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
