import { getAllVendors } from "@/lib/vendors";
import { VendorsContent } from "@/components/VendorsContent";

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
          A few shops and makers of plush that I happily can recommend.
        </p>
      </section>

      <VendorsContent vendors={vendors} />
    </div>
  );
}
