import { AdminAuthProvider } from "@/lib/admin-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-[#f6f7f5]">{children}</div>
    </AdminAuthProvider>
  );
}
