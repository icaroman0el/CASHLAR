import { redirect } from "next/navigation";
import { FinanceDashboard } from "@/components/finance-dashboard";
import { createClient } from "@/lib/supabase/server";
import type { ReceivedMonthShare, TransactionRecord } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profileResult, transactionsResult, receivedSharesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("transactions")
      .select("id, user_id, title, description, category, type, amount, transaction_date, created_at")
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.rpc("get_received_month_shares"),
  ]);

  return (
    <FinanceDashboard
      initialTransactions={(transactionsResult.data ?? []) as TransactionRecord[]}
      initialReceivedShares={(receivedSharesResult.data ?? []) as ReceivedMonthShare[]}
      userEmail={profileResult.data?.email ?? user.email ?? null}
      userName={profileResult.data?.full_name ?? null}
      userId={user.id}
    />
  );
}
