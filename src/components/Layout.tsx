import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, DollarSign, TrendingDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: TrendingDown, label: "Contas a Pagar", path: "/contas-pagar" },
  { icon: DollarSign, label: "Contas a Receber", path: "/contas-receber" },
  { icon: Package, label: "Estoque", path: "/estoque" },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-16 items-center border-b border-border px-6">
          <h1 className="text-xl font-bold text-primary">Sistema ERP</h1>
        </div>
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
};
