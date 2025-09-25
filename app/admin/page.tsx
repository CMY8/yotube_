import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../lib/auth";
import { getErrorLogs } from "../../lib/error-logger";
import { AdminDashboard } from "./dashboard";

export default function AdminPage() {
  const cookieStore = cookies();
  if (!isAdminAuthenticated(cookieStore)) {
    redirect("/login");
  }

  const logs = getErrorLogs();
  return <AdminDashboard logs={logs} />;
}
