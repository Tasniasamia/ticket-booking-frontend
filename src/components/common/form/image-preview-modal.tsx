"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  Maximize,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.25;
const ZERO = { x: 0, y: 0 };

const clampZoom = (n: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(n * 100) / 100));

/* ------------------------------------------------------------------ */
/* Modal                                                              */
/* ------------------------------------------------------------------ */

type ImagePreviewModalProps = {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
};

export function ImagePreviewModal({ open, ...rest }: ImagePreviewModalProps) {
  if (!open || typeof document === "undefined") return null;
  // Portal দিয়ে body তে render হয়, তাই parent এর overflow/transform এ আটকায় না
  return createPortal(<Viewer {...rest} />, document.body);
}

function Viewer({
  src,
  alt = "Image preview",
  onClose,
}: Omit<ImagePreviewModalProps, "open">) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState(ZERO);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(
    null,
  );

  const zoomBy = (delta: number) => {
    const next = clampZoom(zoom + delta);
    setZoom(next);
    if (next <= 1) setOffset(ZERO);
  };

  const rotateBy = (deg: number) => setRotation((r) => r + deg);

  const reset = () => {
    setZoom(1);
    setRotation(0);
    setOffset(ZERO);
  };

  // modal খোলা থাকলে পেছনের page scroll বন্ধ
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // keyboard: Esc, + / -, R (rotate), 0 (reset)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoomBy(ZOOM_STEP);
      else if (e.key === "-") zoomBy(-ZOOM_STEP);
      else if (e.key.toLowerCase() === "r") rotateBy(e.shiftKey ? -90 : 90);
      else if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // zoom করা অবস্থায় drag করে ছবি সরানো
  const onPointerDown = (e: PointerEvent<HTMLImageElement>) => {
    if (zoom <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      px: e.clientX,
      py: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    setDragging(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLImageElement>) => {
    const d = drag.current;
    if (!d) return;
    setOffset({
      x: d.ox + e.clientX - d.px,
      y: d.oy + e.clientY - d.py,
    });
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
      // portal এর event যেন নিচের parent (form/card) এ না যায়
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        title="Close (Esc)"
        className="absolute right-4 top-4 z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-5" />
      </button>

      {/* Image stage (খালি জায়গায় click করলে বন্ধ হবে) */}
      <div
        className="flex h-full w-full items-center justify-center overflow-hidden p-4 pb-24"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onWheel={(e) => zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={() => (zoom > 1 ? reset() : zoomBy(1))}
          className="max-h-[80vh] max-w-[90vw] select-none rounded-lg object-contain shadow-2xl"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
            transition: dragging ? "none" : "transform 200ms ease",
            cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
            touchAction: "none",
          }}
        />
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/10 p-1.5 text-white shadow-lg backdrop-blur-md">
        <ToolButton
          label="Zoom out (-)"
          onClick={() => zoomBy(-ZOOM_STEP)}
          disabled={zoom <= MIN_ZOOM}
        >
          <ZoomOut className="size-5" />
        </ToolButton>

        <span className="w-14 select-none text-center text-sm font-medium tabular-nums">
          {Math.round(zoom * 100)}%
        </span>

        <ToolButton
          label="Zoom in (+)"
          onClick={() => zoomBy(ZOOM_STEP)}
          disabled={zoom >= MAX_ZOOM}
        >
          <ZoomIn className="size-5" />
        </ToolButton>

        <span className="mx-1 h-6 w-px bg-white/20" />

        <ToolButton label="Rotate left (Shift+R)" onClick={() => rotateBy(-90)}>
          <RotateCcw className="size-5" />
        </ToolButton>
        <ToolButton label="Rotate right (R)" onClick={() => rotateBy(90)}>
          <RotateCw className="size-5" />
        </ToolButton>

        <span className="mx-1 h-6 w-px bg-white/20" />

        <ToolButton label="Reset (0)" onClick={reset}>
          <Maximize className="size-5" />
        </ToolButton>
      </div>
    </div>
  );
}

function ToolButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/15 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Eye button (trigger + modal একসাথে)                                 */
/* ------------------------------------------------------------------ */

type ImagePreviewButtonProps = {
  src: string;
  alt?: string;
  className?: string;
  iconClassName?: string;
  title?: string;
};

export function ImagePreviewButton({
  src,
  alt,
  className,
  iconClassName,
  title = "View image",
}: ImagePreviewButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={title}
        aria-label={title}
        className={className}
      >
        <Eye className={cn("size-3.5", iconClassName)} />
      </button>
      <ImagePreviewModal
        open={open}
        src={src}
        alt={alt}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
