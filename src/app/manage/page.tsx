import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllPlushies } from "@/lib/plushies";
import { ManagePanel } from "@/components/ManagePanel";

export const dynamic = "force-dynamic";

export default async function ManagePage() {
  const loggedIn = await isAuthenticated();
  if (!loggedIn) redirect("/login");

  const plushies = getAllPlushies();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Collection</h1>
        <p className="mt-2 text-text-muted">Add, edit, or remove plushies from your catalog.</p>
      </div>
      <ManagePanel initialPlushies={plushies} />
    </div>
  );
}
