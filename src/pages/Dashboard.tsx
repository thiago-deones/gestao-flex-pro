import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DollarSign,
  TrendingDown,
  Package,
  AlertCircle,
  Calendar,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HelpModal from "@/components/HelpModal";

interface ContaReceber {
  id: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: "pendente" | "recebido" | "vencido";
  cliente: string;
}

interface ContaPagar {
  id: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: "pendente" | "pago" | "vencido";
  fornecedor: string;
}

interface Produto {
  id: string;
  nome: string;
  codigo: string;
  quantidade: number;
  estoqueMinimo: number;
  preco: number;
  categoria: string;
}

interface Venda {
  id: string;
  cliente: string;
  data: string;
  total: number;
  tipoPagamento: "imediato" | "futuro";
  vencimento?: string;
  itens: any[];
}

const STORAGE_KEY_CONTAS_RECEBER = "contasReceber";
const STORAGE_KEY_CONTAS_PAGAR = "contasPagar";
const STORAGE_KEY_PRODUTOS = "gestao-flex-pro:produtos";
const STORAGE_KEY_VENDAS = "gestao-flex-pro:vendas";

const Dashboard = () => {
  const [contasReceber, setContasReceber] = useState<ContaReceber[]>([]);
  const [contasPagar, setContasPagar] = useState<ContaPagar[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const storedContasReceber = localStorage.getItem(STORAGE_KEY_CONTAS_RECEBER);
      const storedContasPagar = localStorage.getItem(STORAGE_KEY_CONTAS_PAGAR);
      const storedProdutos = localStorage.getItem(STORAGE_KEY_PRODUTOS);
      const storedVendas = localStorage.getItem(STORAGE_KEY_VENDAS);

      if (storedContasReceber) {
        setContasReceber(JSON.parse(storedContasReceber));
      } else {
        const mockContasReceber: ContaReceber[] = [
          {
            id: "1",
            descricao: "Venda #1234",
            valor: 8500.0,
            vencimento: "2025-11-10",
            status: "pendente",
            cliente: "Cliente ABC Ltda",
          },
          {
            id: "2",
            descricao: "Venda #1235",
            valor: 12300.0,
            vencimento: "2025-11-15",
            status: "pendente",
            cliente: "Cliente XYZ S.A.",
          },
        ];
        setContasReceber(mockContasReceber);
      }

      if (storedContasPagar) {
        setContasPagar(JSON.parse(storedContasPagar));
      } else {
        const mockContasPagar: ContaPagar[] = [
          {
            id: "1",
            descricao: "Fornecedor ABC - Mercadorias",
            valor: 5200.0,
            vencimento: "2025-11-02",
            status: "pendente",
            fornecedor: "Fornecedor ABC",
          },
          {
            id: "2",
            descricao: "Aluguel Comercial",
            valor: 3500.0,
            vencimento: "2025-11-05",
            status: "pendente",
            fornecedor: "Imobiliária XYZ",
          },
        ];
        setContasPagar(mockContasPagar);
      }

      if (storedProdutos) {
        setProdutos(JSON.parse(storedProdutos));
      } else {
        const mockProdutos: Produto[] = [
          {
            id: "1",
            nome: "Produto A",
            codigo: "PRD-001",
            quantidade: 23,
            estoqueMinimo: 50,
            preco: 89.9,
            categoria: "Categoria 1",
          },
          {
            id: "2",
            nome: "Produto B",
            codigo: "PRD-002",
            quantidade: 15,
            estoqueMinimo: 30,
            preco: 149.9,
            categoria: "Categoria 2",
          },
        ];
        setProdutos(mockProdutos);
      }

      if (storedVendas) {
        setVendas(JSON.parse(storedVendas));
      }
    };

    loadData();
    const interval = setInterval(loadData, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Cálculos financeiros
  const totalContasReceber = contasReceber
    .filter((c) => c.status === "pendente")
    .reduce((sum, c) => sum + c.valor, 0);

  const totalContasReceberRecebidas = contasReceber
    .filter((c) => c.status === "recebido")
    .reduce((sum, c) => sum + c.valor, 0);

  const totalContasPagar = contasPagar
    .filter((c) => c.status === "pendente")
    .reduce((sum, c) => sum + c.valor, 0);

  const totalContasPagarPagas = contasPagar
    .filter((c) => c.status === "pago")
    .reduce((sum, c) => sum + c.valor, 0);

  const saldoFinanceiro = totalContasReceber - totalContasPagar;

  // Cálculos de vendas
  const totalVendas = vendas.reduce((sum, v) => sum + v.total, 0);
  const totalVendasMes = vendas
    .filter((v) => {
      const dataVenda = new Date(v.data);
      const hoje = new Date();
      return (
        dataVenda.getMonth() === hoje.getMonth() &&
        dataVenda.getFullYear() === hoje.getFullYear()
      );
    })
    .reduce((sum, v) => sum + v.total, 0);

  const vendasImediatas = vendas.filter((v) => v.tipoPagamento === "imediato");
  const receitaImediata = vendasImediatas.reduce((sum, v) => sum + v.total, 0);

  // Cálculos de estoque
  const totalProdutos = produtos.reduce((sum, p) => sum + p.quantidade, 0);
  const valorTotalEstoque = produtos.reduce(
    (sum, p) => sum + p.quantidade * p.preco,
    0
  );
  const produtosEstoqueBaixo = produtos.filter(
    (p) => p.quantidade < p.estoqueMinimo
  );

  // Contas vencendo
  const hoje = new Date();
  const proximaSemana = new Date();
  proximaSemana.setDate(hoje.getDate() + 7);

  const contasPagarVencendo = contasPagar
    .filter((c) => {
      if (c.status === "pago") return false;
      const dataVencimento = new Date(c.vencimento);
      return dataVencimento >= hoje && dataVencimento <= proximaSemana;
    })
    .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime())
    .slice(0, 5);

  const contasReceberVencendo = contasReceber
    .filter((c) => {
      if (c.status === "recebido") return false;
      const dataVencimento = new Date(c.vencimento);
      return dataVencimento >= hoje && dataVencimento <= proximaSemana;
    })
    .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime())
    .slice(0, 5);


  // Vendas recentes
  const vendasRecentes = vendas
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const calcularDiasAteVencimento = (dataVencimento: string) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = new Date(dataVencimento);
    vencimento.setHours(0, 0, 0, 0);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setHelpModalOpen(true)}
          className="gap-2"
        >
          <HelpCircle className="h-5 w-5" />
          Preciso de Ajuda
        </Button>
      </div>

      <HelpModal open={helpModalOpen} onOpenChange={setHelpModalOpen} />

      {/* Cards de Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Contas a Receber"
          value={formatCurrency(totalContasReceber)}
          icon={DollarSign}
          trend={`${contasReceber.filter((c) => c.status === "pendente").length} contas pendentes`}
          trendUp={true}
        />
        <StatCard
          title="Contas a Pagar"
          value={formatCurrency(totalContasPagar)}
          icon={TrendingDown}
          trend={`${contasPagar.filter((c) => c.status === "pendente").length} contas pendentes`}
          trendUp={false}
        />
        <StatCard
          title="Produtos em Estoque"
          value={totalProdutos.toString()}
          icon={Package}
          trend={`${produtos.length} tipos de produtos`}
        />
        <StatCard
          title="Alertas de Estoque"
          value={produtosEstoqueBaixo.length.toString()}
          icon={AlertCircle}
          trend={
            produtosEstoqueBaixo.length > 0
              ? "Atenção necessária"
              : "Tudo em ordem"
          }
        />
      </div>

      {/* Vendas Recentes */}
      {vendas.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vendas Recentes</CardTitle>
                <CardDescription>Últimas vendas realizadas</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/vendas">Ver todas</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vendasRecentes.map((venda) => (
                <div
                  key={venda.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{venda.cliente}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(venda.data)} • {venda.itens.length}{" "}
                      {venda.itens.length === 1 ? "item" : "itens"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(venda.total)}</p>
                    <p className="text-xs text-muted-foreground">
                      {venda.tipoPagamento === "imediato" ? "Pago" : "A receber"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>Visão geral das finanças</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">A Receber (Pendente)</span>
                <span className="font-semibold text-primary">
                  {formatCurrency(totalContasReceber)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">A Pagar (Pendente)</span>
                <span className="font-semibold text-destructive">
                  {formatCurrency(totalContasPagar)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Recebido (Total)</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(totalContasReceberRecebidas)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pago (Total)</span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(totalContasPagarPagas)}
                </span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Saldo Disponível</span>
                  <span
                    className={`font-bold text-lg ${
                      saldoFinanceiro >= 0 ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {formatCurrency(saldoFinanceiro)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Vendas</CardTitle>
            <CardDescription>Estatísticas de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total de Vendas</span>
                <span className="font-semibold">{vendas.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vendas do Mês</span>
                <span className="font-semibold text-primary">
                  {formatCurrency(totalVendasMes)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Receita Imediata</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(receitaImediata)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vendas a Receber</span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(totalVendas - receitaImediata)}
                </span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Geral</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(totalVendas)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Cards Informativos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Contas a Pagar Vencendo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Contas a Pagar Vencendo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contasPagarVencendo.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma conta vencendo esta semana
              </p>
            ) : (
              <div className="space-y-3">
                {contasPagarVencendo.map((conta) => {
                  const dias = calcularDiasAteVencimento(conta.vencimento);
                  return (
                    <div
                      key={conta.id}
                      className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{conta.fornecedor}</p>
                        <p className="text-xs text-muted-foreground">
                          {dias === 0
                            ? "Vence hoje"
                            : dias === 1
                            ? "Vence amanhã"
                            : `Vence em ${dias} dias`}
                        </p>
                      </div>
                      <span className="font-semibold text-destructive text-sm ml-2">
                        {formatCurrency(conta.valor)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/contas-pagar">Ver todas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contas a Receber Vencendo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Contas a Receber Vencendo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contasReceberVencendo.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma conta vencendo esta semana
              </p>
            ) : (
              <div className="space-y-3">
                {contasReceberVencendo.map((conta) => {
                  const dias = calcularDiasAteVencimento(conta.vencimento);
                  return (
                    <div
                      key={conta.id}
                      className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{conta.cliente}</p>
                        <p className="text-xs text-muted-foreground">
                          {dias === 0
                            ? "Vence hoje"
                            : dias === 1
                            ? "Vence amanhã"
                            : `Vence em ${dias} dias`}
                        </p>
                      </div>
                      <span className="font-semibold text-primary text-sm ml-2">
                        {formatCurrency(conta.valor)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/contas-receber">Ver todas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Produtos com Estoque Baixo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {produtosEstoqueBaixo.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum produto com estoque baixo
              </p>
            ) : (
              <div className="space-y-3">
                {produtosEstoqueBaixo.slice(0, 5).map((produto) => (
                  <div
                    key={produto.id}
                    className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{produto.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        Mínimo: {produto.estoqueMinimo}
                      </p>
                    </div>
                    <span className="font-semibold text-destructive text-sm ml-2">
                      {produto.quantidade}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/estoque">Ver estoque</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
