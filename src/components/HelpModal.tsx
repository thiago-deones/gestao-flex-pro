import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HelpCircle,
  Mail,
  ChevronRight,
  ShoppingCart,
  DollarSign,
  TrendingDown,
  Package,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpModal = ({ open, onOpenChange }: HelpModalProps) => {
  const handleContactSupport = () => {
    window.location.href = "mailto:suporte@gestaoflexpro.com?subject=Preciso de Ajuda";
  };

  const steps = [
    {
      icon: BarChart3,
      title: "Dashboard - Visão Geral",
      description: "O dashboard é sua central de informações. Aqui você vê:",
      details: [
        "Contas a receber e a pagar pendentes",
        "Produtos em estoque e alertas de estoque baixo",
        "Vendas recentes e resumo financeiro",
        "Contas vencendo nos próximos 7 dias",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Gerenciar Vendas",
      description: "Para registrar uma nova venda:",
      details: [
        "Acesse a página 'Vendas' no menu",
        "Clique em 'Nova Venda'",
        "Adicione produtos ao carrinho",
        "Escolha o tipo de pagamento (imediato ou futuro)",
        "Se for pagamento futuro, defina a data de vencimento",
        "Finalize a venda - o estoque será atualizado automaticamente",
      ],
    },
    {
      icon: DollarSign,
      title: "Contas a Receber",
      description: "Para gerenciar recebimentos:",
      details: [
        "Acesse 'Contas a Receber' no menu",
        "Visualize todas as contas pendentes",
        "Clique em 'Marcar como Recebido' quando receber o pagamento",
        "As vendas com pagamento futuro criam contas automaticamente",
        "Acompanhe contas vencidas e próximas do vencimento",
      ],
    },
    {
      icon: TrendingDown,
      title: "Contas a Pagar",
      description: "Para gerenciar despesas:",
      details: [
        "Acesse 'Contas a Pagar' no menu",
        "Clique em 'Nova Conta' para adicionar uma despesa",
        "Preencha os dados: descrição, valor, vencimento e fornecedor",
        "Clique em 'Marcar como Pago' quando efetuar o pagamento",
        "Acompanhe o saldo disponível no dashboard",
      ],
    },
    {
      icon: Package,
      title: "Gerenciar Estoque",
      description: "Para controlar seu estoque:",
      details: [
        "Acesse 'Estoque' no menu",
        "Visualize todos os produtos cadastrados",
        "Clique em 'Novo Produto' para adicionar itens",
        "Edite quantidades diretamente na tabela",
        "Defina o estoque mínimo para receber alertas",
        "O estoque é atualizado automaticamente quando você realiza vendas",
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <HelpCircle className="h-6 w-6 text-primary" />
            Central de Ajuda
          </DialogTitle>
          <DialogDescription>
            Siga o passo a passo para aprender a usar todas as funcionalidades
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Bem-vindo ao Gestão Flex Pro!
            </h3>
            <p className="text-sm text-muted-foreground">
              Este guia rápido vai te ajudar a dominar todas as funcionalidades da ferramenta.
              Siga os passos abaixo para começar a gerenciar seu negócio de forma eficiente.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <Icon className="h-5 w-5 text-primary" />
                      {step.title}
                    </CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleContactSupport}
              className="flex-1"
              variant="outline"
            >
              <Mail className="h-4 w-4 mr-2" />
              Falar com Suporte
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Entendi, obrigado!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;

