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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  cliente: z.string().min(1, "Cliente é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
});

interface ContaReceber {
  id: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: "pendente" | "recebido" | "vencido";
  cliente: string;
}

const mockData: ContaReceber[] = [
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
  {
    id: "3",
    descricao: "Venda #1236",
    valor: 5600.0,
    vencimento: "2025-11-08",
    status: "pendente",
    cliente: "Cliente DEF Comércio",
  },
  {
    id: "4",
    descricao: "Venda #1233",
    valor: 7800.0,
    vencimento: "2025-10-28",
    status: "recebido",
    cliente: "Cliente GHI Indústria",
  },
];

const ContasReceber = () => {
  const [contas, setContas] = useState<ContaReceber[]>(mockData);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: "",
      descricao: "",
      valor: "",
      vencimento: "",
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: "default",
      recebido: "secondary",
      vencido: "destructive",
    } as const;
    
    const labels = {
      pendente: "Pendente",
      recebido: "Recebido",
      vencido: "Vencido",
    };

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const novaConta: ContaReceber = {
      id: String(contas.length + 1),
      cliente: values.cliente,
      descricao: values.descricao,
      valor: parseFloat(values.valor),
      vencimento: values.vencimento,
      status: "pendente",
    };
    
    setContas([novaConta, ...contas]);
    toast.success("Conta a receber adicionada com sucesso!");
    form.reset();
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
          <h2 className="text-3xl font-bold tracking-tight">Contas a Receber</h2>
          <p className="text-muted-foreground">Gerencie suas contas a receber</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <DialogHeader>
                  <DialogTitle>Adicionar Conta a Receber</DialogTitle>
                  <DialogDescription>Adicione uma nova conta a receber ao sistema</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="cliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Descrição da venda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0,00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vencimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Vencimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Adicionar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contas.map((conta) => (
                <TableRow key={conta.id}>
                  <TableCell className="font-medium">{conta.cliente}</TableCell>
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

export default ContasReceber;
