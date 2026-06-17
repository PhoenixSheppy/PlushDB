import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllPlushies } from "@/lib/plushies";
import { getAllVendors } from "@/lib/vendors";
import { ManageTabs } from "@/components/ManageTabs";

export const dynamic = "force-dynamic";

export default async function ManagePage() {
  const loggedIn = await isAuthenticated();
  if (!loggedIn) redirect("/login");

  const [plushies, vendors] = await Promise.all([
    Promise.resolve(getAllPlushies()),
    Promise.resolve(getAllVendors()),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Collection</h1>
        <p className="mt-2 text-text-muted">
          Add, edit, or remove plushies and trusted vendors from your catalog.
        </p>
      </div>
      <ManageTabs initialPlushies={plushies} initialVendors={vendors} />
    </div>
  );
}
