import type { MouseEvent } from "react";
import type { Vendor } from "@/types";
import { formatWebsiteUrl, websiteHref } from "@/lib/vendor-url";
import { TiltCard } from "./TiltCard";
import { VendorLogo } from "./VendorLogo";

type Props = {
  vendor: Vendor;
  showAdmin?: boolean;
  onClick?: () => void;
  onEdit?: (vendor: Vendor) => void;
  onDelete?: (id: number) => void;
};

export function VendorCard({ vendor, showAdmin, onClick, onEdit, onDelete }: Props) {
  function stopClick(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <TiltCard>
      <article
        onClick={onClick}
        className={`glass flex flex-col gap-4 rounded-2xl p-5 transition-colors hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 sm:flex-row ${
          onClick ? "cursor-pointer" : ""
        }`}
      >
        <VendorLogo name={vendor.name} logoPath={vendor.logo_path} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-tight">{vendor.name}</h3>
              {vendor.short_description && (
                <p className="mt-0.5 text-sm italic text-text-muted">{vendor.short_description}</p>
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
                onClick={stopClick}
                className="shrink-0 text-sm text-accent transition-colors hover:text-accent-hover hover:underline"
              >
                {formatWebsiteUrl(vendor.website_url)}
              </a>
            )}
          </div>

          {vendor.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-muted">
              {vendor.description}
            </p>
          )}

          {showAdmin && (
            <div
              className="mt-4 flex justify-end gap-2 border-t border-border-subtle pt-3"
              onClick={stopClick}
            >
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(vendor)}
                  className="rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface-overlay hover:text-text"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(vendor.id)}
                  className="rounded-md px-2 py-1 text-xs text-red-400/80 transition-colors hover:bg-red-400/10 hover:text-red-400"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </article>
    </TiltCard>
  );
}
