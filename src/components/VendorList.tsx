"use client";

import { useState } from "react";
import type { Vendor } from "@/types";
import { VendorCard } from "./VendorCard";
import { VendorDetailModal } from "./VendorDetailModal";

type Props = {
  vendors: Vendor[];
  showAdmin?: boolean;
  onEdit?: (vendor: Vendor) => void;
  onDelete?: (id: number) => void;
};

export function VendorList({ vendors, showAdmin, onEdit, onDelete }: Props) {
  const [selected, setSelected] = useState<Vendor | null>(null);

  return (
    <>
      <div className="space-y-4">
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            showAdmin={showAdmin}
            onClick={() => setSelected(vendor)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {selected && (
        <VendorDetailModal vendor={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
