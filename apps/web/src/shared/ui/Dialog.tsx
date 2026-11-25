"use client";

import { useEffect, useId, type ReactNode, type RefObject } from "react";

type Props = {
  title: string;
  description?: ReactNode;
  onClose: () => void;
  /** Set to false while an action is running, so Escape and the backdrop do nothing. */
  dismissible?: boolean;
  /** Element to focus when the dialog opens. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  children?: ReactNode;
};

/** Modal shell: backdrop, Escape to close, initial focus, and scroll lock. Mount it only while open. */
export function Dialog({
  title,
  description,
  onClose,
  dismissible = true,
  initialFocusRef,
  children,
}: Props) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    initialFocusRef?.current?.focus();
  }, [initialFocusRef]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && dismissible) onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [dismissible, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        disabled={!dismissible}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="card relative w-full max-w-md p-6"
      >
        <h2
          id={titleId}
          className="text-lg font-semibold tracking-[-0.02em] text-[var(--fg)]"
        >
          {title}
        </h2>
        {description ? (
          <div
            id={descriptionId}
            className="mt-2 text-sm leading-relaxed text-[var(--muted)]"
          >
            {description}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
