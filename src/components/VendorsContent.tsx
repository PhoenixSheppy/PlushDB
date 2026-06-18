"use client";

import type { Vendor } from "@/types";
import { useMatureContent } from "@/components/MatureContentProvider";
import { VendorList } from "@/components/VendorList";

type Props = {
  vendors: Vendor[];
};

export function VendorsContent({ vendors }: Props) {
  const { matureEnabled } = useMatureContent();
  const trustedVendors = vendors.filter((vendor) => !vendor.is_mature);
  const matureVendors = vendors.filter((vendor) => vendor.is_mature);

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Trusted</h2>
          <p className="mx-auto max-w-lg text-sm text-text-muted">
            Shops and makers I&apos;d happily recommend to anyone looking for a new friend.
          </p>
        </div>

        {trustedVendors.length > 0 ? (
          <VendorList vendors={trustedVendors} />
        ) : (
          <div className="glass rounded-2xl p-12 text-center text-text-muted">
            No trusted vendors listed yet.
          </div>
        )}
      </section>

      {matureEnabled && matureVendors.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              <span className="text-accent">Modders</span>
            </h2>
            <p className="mx-auto max-w-lg text-sm text-text-muted">
              Independent modders I&apos;ve worked with in the past that I can recommend.
            </p>
          </div>

          <VendorList vendors={matureVendors} />
        </section>
      )}
    </div>
  );
}
