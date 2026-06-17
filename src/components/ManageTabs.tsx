"use client";

import { useState } from "react";
import type { Plushie, Vendor } from "@/types";
import { ManagePanel } from "./ManagePanel";
import { ManageVendorsPanel } from "./ManageVendorsPanel";

type Tab = "plushies" | "vendors";

type Props = {
  initialPlushies: Plushie[];
  initialVendors: Vendor[];
};

export function ManageTabs({ initialPlushies, initialVendors }: Props) {
  const [tab, setTab] = useState<Tab>("plushies");

  return (
    <div className="space-y-8">
      <div className="flex gap-2 rounded-xl border border-border-subtle bg-surface-raised p-1">
        <button
          type="button"
          onClick={() => setTab("plushies")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "plushies"
              ? "bg-accent text-surface"
              : "text-text-muted hover:bg-surface-overlay hover:text-text"
          }`}
        >
          Plushies
        </button>
        <button
          type="button"
          onClick={() => setTab("vendors")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "vendors"
              ? "bg-accent text-surface"
              : "text-text-muted hover:bg-surface-overlay hover:text-text"
          }`}
        >
          Vendors
        </button>
      </div>

      {tab === "plushies" ? (
        <ManagePanel initialPlushies={initialPlushies} />
      ) : (
        <ManageVendorsPanel initialVendors={initialVendors} />
      )}
    </div>
  );
}
