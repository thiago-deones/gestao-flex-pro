import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, DollarSign, TrendingDown, Package, LogOut, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: ShoppingCart, label: "Vendas", path: "/vendas" },
  { icon: TrendingDown, label: "Contas a Pagar", path: "/contas-pagar" },
  { icon: DollarSign, label: "Contas a Receber", path: "/contas-receber" },
  { icon: Package, label: "Estoque", path: "/estoque" },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card flex flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="h-6 w-6 text-primary"
            fill="none"
          >
            <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.1" />
            <g transform="translate(12, 12)">
              <rect x="4" y="24" width="6" height="16" fill="currentColor" rx="2" />
              <rect x="14" y="16" width="6" height="24" fill="currentColor" rx="2" />
              <rect x="24" y="20" width="6" height="20" fill="currentColor" rx="2" />
              <rect x="34" y="12" width="6" height="28" fill="currentColor" rx="2" />
              <line
                x1="0"
                y1="40"
                x2="44"
                y2="40"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              />
              <line
                x1="0"
                y1="30"
                x2="44"
                y2="30"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              />
              <line
                x1="0"
                y1="20"
                x2="44"
                y2="20"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              />
              <line
                x1="0"
                y1="10"
                x2="44"
                y2="10"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
              />
            </g>
            <circle cx="48" cy="16" r="8" fill="currentColor" />
            <path
              d="M45 16 L47 18 L51 14"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-xl font-bold text-primary">Sistema ERP</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
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
        <div className="border-t border-border p-4">
          <div className="mb-3 px-3 text-sm text-muted-foreground">
            <p className="truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
};
