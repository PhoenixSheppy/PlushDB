"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { formatWebsiteUrl, websiteHref } from "@/lib/vendor-url";
import type { Vendor } from "@/types";
import { VendorLogo } from "./VendorLogo";
import "@/lib/fontawesome";

type Props = {
  vendor: Vendor;
  onClose: () => void;
};

export function VendorDetailModal({ vendor, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="glass relative z-10 w-full max-w-2xl scale-100 rounded-2xl p-6 shadow-2xl shadow-black/40 transition-all duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-overlay hover:text-text"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          <div className="mx-auto shrink-0 sm:mx-0">
            <VendorLogo name={vendor.name} logoPath={vendor.logo_path} />
          </div>

          <div className="min-w-0 flex-1 space-y-3 pr-6">
            <div>
              <h2 id="vendor-detail-title" className="text-2xl font-bold leading-tight">
                {vendor.name}
              </h2>
              {vendor.short_description && (
                <p className="mt-1 text-sm italic text-text-muted">{vendor.short_description}</p>
              )}
              {vendor.location && (
                <p className="mt-1 text-sm text-text-muted">{vendor.location}</p>
              )}
            </div>

            {vendor.website_url && (
              <a
                href={websiteHref(vendor.website_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-overlay px-4 py-2 text-sm text-accent transition-colors hover:border-accent/30 hover:text-accent-hover"
              >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3.5 w-3.5" />
                {formatWebsiteUrl(vendor.website_url)}
              </a>
            )}
          </div>
        </div>

        {vendor.description && (
          <p className="mt-6 text-sm leading-relaxed text-text-muted">{vendor.description}</p>
        )}
      </div>
    </div>
  );
}
