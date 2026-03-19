import { SidebarProvider } from "@/components/navigation/sidebar-provider";
import { Header } from "@/components/navigation/header";
import { Sidebar } from "@/components/navigation/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Header />
        <Sidebar />
        <main className="pt-14">{children}</main>
      </div>
    </SidebarProvider>
  );
}
