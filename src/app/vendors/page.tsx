import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { getAllVendors } from "@/lib/vendors";
import { VendorList } from "@/components/VendorList";
import "@/lib/fontawesome";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  const vendors = getAllVendors();

  return (
    <div className="space-y-10">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Trusted <span className="text-accent">Vendors</span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-text-muted">
          A few shops and makers I trust for plushies — places I&apos;d happily recommend to anyone looking for a new friend.
        </p>
      </section>

      {vendors.length > 0 ? (
        <VendorList vendors={vendors} />
      ) : (
        <div className="glass rounded-2xl p-12 text-center text-text-muted">
          No trusted vendors listed yet.
        </div>
      )}

    </div>
  );
}
