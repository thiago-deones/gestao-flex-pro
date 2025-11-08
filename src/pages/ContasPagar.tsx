import { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
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
  fornecedor: z.string().min(1, "Fornecedor é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  vencimento: z.string().min(1, "Data de vencimento é obrigatória"),
});

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
  const [contas, setContas] = useState<ContaPagar[]>(() => {
    const savedContas = localStorage.getItem('contasPagar');
    return savedContas ? JSON.parse(savedContas) : mockData;
  });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Salva as contas no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('contasPagar', JSON.stringify(contas));
  }, [contas]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fornecedor: "",
      descricao: "",
      valor: "",
      vencimento: "",
    },
  });

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

  const handleEdit = (conta: ContaPagar) => {
    setEditingId(conta.id);
    form.reset({
      fornecedor: conta.fornecedor,
      descricao: conta.descricao,
      valor: String(conta.valor),
      vencimento: conta.vencimento,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta conta?")) {
      setContas(contas.filter((conta) => conta.id !== id));
      toast.success("Conta excluída com sucesso!");
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingId) {
      setContas(contas.map((conta) =>
        conta.id === editingId
          ? {
              ...conta,
              fornecedor: values.fornecedor,
              descricao: values.descricao,
              valor: parseFloat(values.valor),
              vencimento: values.vencimento,
            }
          : conta
      ));
      toast.success("Conta atualizada com sucesso!");
      setEditingId(null);
    } else {
      const novaConta: ContaPagar = {
        id: String(contas.length + 1),
        fornecedor: values.fornecedor,
        descricao: values.descricao,
        valor: parseFloat(values.valor),
        vencimento: values.vencimento,
        status: "pendente",
      };
      setContas([novaConta, ...contas]);
      toast.success("Conta a pagar adicionada com sucesso!");
    }
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <DialogHeader>
                  <DialogTitle>Adicionar Conta a Pagar</DialogTitle>
                  <DialogDescription>Adicione uma nova conta a pagar ao sistema</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="fornecedor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fornecedor</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do fornecedor" {...field} />
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
                          <Input placeholder="Descrição da conta" {...field} />
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
                <TableHead>Ações</TableHead>
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
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(conta)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(conta.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
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
