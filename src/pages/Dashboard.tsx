import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, Package, AlertCircle } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Contas a Receber"
          value="R$ 45.231,00"
          icon={DollarSign}
          trend="+12% em relação ao mês anterior"
          trendUp={true}
        />
        <StatCard
          title="Contas a Pagar"
          value="R$ 23.450,00"
          icon={TrendingDown}
          trend="-5% em relação ao mês anterior"
          trendUp={true}
        />
        <StatCard
          title="Produtos em Estoque"
          value="342"
          icon={Package}
        />
        <StatCard
          title="Alertas de Estoque"
          value="12"
          icon={AlertCircle}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contas Vencendo Esta Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="font-medium">Fornecedor ABC</p>
                  <p className="text-sm text-muted-foreground">Vence em 2 dias</p>
                </div>
                <span className="font-semibold text-destructive">R$ 5.200,00</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="font-medium">Aluguel</p>
                  <p className="text-sm text-muted-foreground">Vence em 5 dias</p>
                </div>
                <span className="font-semibold text-destructive">R$ 3.500,00</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Energia Elétrica</p>
                  <p className="text-sm text-muted-foreground">Vence em 6 dias</p>
                </div>
                <span className="font-semibold text-destructive">R$ 890,00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="font-medium">Produto A</p>
                  <p className="text-sm text-muted-foreground">Estoque mínimo: 50</p>
                </div>
                <span className="font-semibold text-warning">23 unidades</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="font-medium">Produto B</p>
                  <p className="text-sm text-muted-foreground">Estoque mínimo: 30</p>
                </div>
                <span className="font-semibold text-warning">15 unidades</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Produto C</p>
                  <p className="text-sm text-muted-foreground">Estoque mínimo: 100</p>
                </div>
                <span className="font-semibold text-warning">67 unidades</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
