import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1", trendUp ? "text-success" : "text-destructive")}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
