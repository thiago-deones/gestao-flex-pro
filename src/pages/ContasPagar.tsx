import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ContaPagar {
  id: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: "pendente" | "pago" | "vencido";
  fornecedor: string;
}

const mockData: ContaPagar[] = [
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
  {
    id: "3",
    descricao: "Energia Elétrica",
    valor: 890.0,
    vencimento: "2025-11-06",
    status: "pendente",
    fornecedor: "Companhia de Energia",
  },
  {
    id: "4",
    descricao: "Fornecedor DEF - Materiais",
    valor: 2300.0,
    vencimento: "2025-10-25",
    status: "pago",
    fornecedor: "Fornecedor DEF",
  },
];

const ContasPagar = () => {
  const [contas, setContas] = useState<ContaPagar[]>(mockData);
  const [open, setOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: "default",
      pago: "secondary",
      vencido: "destructive",
    } as const;
    
    const labels = {
      pendente: "Pendente",
      pago: "Pago",
      vencido: "Vencido",
    };

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Conta a pagar adicionada com sucesso!");
    setOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contas a Pagar</h2>
          <p className="text-muted-foreground">Gerencie suas contas a pagar</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Adicionar Conta a Pagar</DialogTitle>
                <DialogDescription>Adicione uma nova conta a pagar ao sistema</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fornecedor">Fornecedor</Label>
                  <Input id="fornecedor" placeholder="Nome do fornecedor" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input id="descricao" placeholder="Descrição da conta" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="valor">Valor</Label>
                  <Input id="valor" type="number" step="0.01" placeholder="0,00" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vencimento">Data de Vencimento</Label>
                  <Input id="vencimento" type="date" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contas.map((conta) => (
                <TableRow key={conta.id}>
                  <TableCell className="font-medium">{conta.fornecedor}</TableCell>
                  <TableCell>{conta.descricao}</TableCell>
                  <TableCell>{formatCurrency(conta.valor)}</TableCell>
                  <TableCell>{formatDate(conta.vencimento)}</TableCell>
                  <TableCell>{getStatusBadge(conta.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContasPagar;
