"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function MobileFilterDialog({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-0 ml-auto h-dvh w-[min(92vw,24rem)] max-w-none bg-surface-primary p-0 text-content-primary backdrop:bg-black/30 md:hidden"
      aria-labelledby="mobile-filter-title"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border-primary px-5 py-4">
          <h2 id="mobile-filter-title" className="type-headline-sm">
            Filter products
          </h2>
          <Button variant="ghost" onClick={onClose} className="min-h-10 px-3">
            Close
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        <div className="border-t border-border-primary p-4">
          <Button variant="brand" onClick={onClose} className="w-full">
            Show results
          </Button>
        </div>
      </div>
    </dialog>
  );
}
