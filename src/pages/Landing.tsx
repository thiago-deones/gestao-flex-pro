import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  DollarSign,
  Package,
  TrendingDown,
  BarChart3,
  Shield,
  Zap,
  Users,
  ShoppingCart,
  RefreshCw,
  TrendingUp,
  DollarSign as DollarSignIcon,
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: "Gestão de Vendas",
      description: "Registre vendas com múltiplos produtos. Integração automática com estoque e contas a receber.",
    },
    {
      icon: DollarSign,
      title: "Contas a Receber",
      description: "Gerencie recebimentos e marque como recebido com um clique. Controle total dos seus recebíveis.",
    },
    {
      icon: TrendingDown,
      title: "Contas a Pagar",
      description: "Controle despesas e prazos. Marque contas como pagas diretamente na tabela.",
    },
    {
      icon: Package,
      title: "Estoque em Tempo Real",
      description: "Ajuste quantidades diretamente na tabela. Atualização instantânea com alertas automáticos.",
    },
    {
      icon: BarChart3,
      title: "Dashboard Completo",
      description: "Visão 360° do negócio: vendas, finanças, estoque e alertas em um só lugar.",
    },
    {
      icon: RefreshCw,
      title: "Integração Total",
      description: "Vendas atualizam estoque automaticamente e criam contas a receber quando necessário.",
    },
  ];

  const advantages = [
    {
      icon: Zap,
      title: "Rápido e Eficiente",
      description: "Interface intuitiva que acelera suas operações diárias.",
    },
    {
      icon: Shield,
      title: "Seguro e Confiável",
      description: "Seus dados protegidos com as melhores práticas de segurança.",
    },
    {
      icon: Users,
      title: "Fácil de Usar",
      description: "Sistema simples que qualquer pessoa pode dominar rapidamente.",
    },
  ];

  const differentiators = [
    {
      icon: TrendingUp,
      title: "Acessível para PMEs",
      description: "Criado especialmente para pequenas e médias empresas. Sem complexidade desnecessária ou custos proibitivos.",
    },
    {
      icon: DollarSignIcon,
      title: "Custo-Benefício Excepcional",
      description: "Planos a partir de R$ 0. Comece grátis e pague apenas pelo que realmente precisa, sem surpresas.",
    },
    {
      icon: Users,
      title: "Barreira de Entrada Baixa",
      description: "Não precisa de treinamento extensivo ou equipe técnica. Configure e comece a usar em minutos.",
    },
  ];

  const pricingPlans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "Até 100 transações/mês",
        "Gestão de vendas e estoque",
        "Contas a pagar e receber",
        "Dashboard com métricas essenciais",
        "Ajuste de estoque em tempo real",
        "Suporte por email",
      ],
      popular: false,
    },
    {
      name: "Profissional",
      price: "R$ 9,90",
      period: "/mês",
      description: "Para pequenas empresas",
      features: [
        "Transações ilimitadas",
        "Gestão completa de vendas",
        "Estoque em tempo real",
        "Contas a pagar/receber integradas",
        "Dashboard completo com todas as métricas",
        "Histórico de vendas e relatórios",
        "Suporte prioritário",
        "Backup automático",
      ],
      popular: true,
    },
    {
      name: "Empresarial",
      price: "R$ 29,90",
      period: "/mês",
      description: "Para empresas em crescimento",
      features: [
        "Tudo do plano Profissional",
        "Múltiplos usuários",
        "Integração completa: vendas → estoque → contas",
        "Dashboard executivo avançado",
        "API de integração",
        "Suporte 24/7",
        "Treinamento personalizado",
        "Consultoria incluída",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-2">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Gestão Flex Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-12 max-w-7xl py-12 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          Gerencie seu negócio de forma{" "}
          <span className="text-primary">inteligente e simples</span>
        </h1>
        <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
          Sistema completo de gestão empresarial: vendas, finanças, estoque e relatórios integrados. 
          Comece grátis e evolua conforme sua empresa cresce.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/login">Começar Grátis</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-12 max-w-7xl py-12">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Tudo que você precisa em um só lugar
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Advantages Section */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-12 max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Por que escolher o Gestão Flex Pro?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {advantages.map((advantage) => {
              const Icon = advantage.icon;
              return (
                <Card key={advantage.title}>
                  <CardHeader>
                    <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{advantage.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="container mx-auto px-12 max-w-7xl py-12">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Acessível para Pequenas e Médias Empresas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Um sistema ERP completo sem a complexidade e os custos altos dos sistemas tradicionais. 
            Perfeito para empresas que querem crescer sem quebrar o orçamento.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {differentiators.map((differentiator) => {
            const Icon = differentiator.icon;
            return (
              <Card key={differentiator.title} className="border-primary/20">
                <CardHeader>
                  <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{differentiator.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{differentiator.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-lg font-semibold mb-2">
                Sem investimento inicial • Sem taxa de setup • Sem compromisso
              </p>
              <p className="text-muted-foreground">
                Comece grátis hoje mesmo e veja como é fácil gerenciar seu negócio de forma profissional
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-12 max-w-7xl py-12">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Planos e Preços</h2>
          <p className="text-muted-foreground">
            Escolha o plano ideal para o seu negócio
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? "border-primary border-2" : ""}
            >
              <CardHeader>
                {plan.popular && (
                  <div className="mb-2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Mais Popular
                    </span>
                  </div>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/login">
                    {plan.name === "Gratuito" ? "Começar Grátis" : "Assinar"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Gestão Flex Pro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

