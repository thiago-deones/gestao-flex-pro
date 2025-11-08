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
import { Plus, AlertCircle, Pencil, Trash2 } from "lucide-react";
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
  nome: z.string().min(1, "Nome é obrigatório"),
  codigo: z.string().min(1, "Código é obrigatório"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  quantidade: z.string().min(1, "Quantidade é obrigatória"),
  estoqueMinimo: z.string().min(1, "Estoque mínimo é obrigatório"),
  preco: z.string().min(1, "Preço é obrigatório"),
});

interface Produto {
  id: string;
  nome: string;
  codigo: string;
  quantidade: number;
  estoqueMinimo: number;
  preco: number;
  categoria: string;
}

const mockData: Produto[] = [
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
  {
    id: "3",
    nome: "Produto C",
    codigo: "PRD-003",
    quantidade: 67,
    estoqueMinimo: 100,
    preco: 59.9,
    categoria: "Categoria 1",
  },
  {
    id: "4",
    nome: "Produto D",
    codigo: "PRD-004",
    quantidade: 234,
    estoqueMinimo: 80,
    preco: 199.9,
    categoria: "Categoria 3",
  },
];

const STORAGE_KEY = "gestao-flex-pro:produtos";

const Estoque = () => {
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    const storedProdutos = localStorage.getItem(STORAGE_KEY);
    return storedProdutos ? JSON.parse(storedProdutos) : mockData;
  });
  const [open, setOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      codigo: "",
      categoria: "",
      quantidade: "",
      estoqueMinimo: "",
      preco: "",
    },
  });

  const isEstoqueBaixo = (quantidade: number, minimo: number) => {
    return quantidade < minimo;
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (produtoParaEditar) {
      const produtosAtualizados = produtos.map((produto) =>
        produto.id === produtoParaEditar.id
          ? {
              ...produto,
              nome: values.nome,
              codigo: values.codigo,
              categoria: values.categoria,
              quantidade: parseInt(values.quantidade),
              estoqueMinimo: parseInt(values.estoqueMinimo),
              preco: parseFloat(values.preco),
            }
          : produto
      );
      const newProdutos = produtosAtualizados;
      setProdutos(newProdutos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProdutos));
      toast.success("Produto atualizado com sucesso!");
    } else {
      const novoProduto: Produto = {
        id: String(produtos.length + 1),
        nome: values.nome,
        codigo: values.codigo,
        categoria: values.categoria,
        quantidade: parseInt(values.quantidade),
        estoqueMinimo: parseInt(values.estoqueMinimo),
        preco: parseFloat(values.preco),
      };
      const newProdutos = [novoProduto, ...produtos];
      setProdutos(newProdutos);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProdutos));
      toast.success("Produto adicionado com sucesso!");
    }
    form.reset();
    setOpen(false);
    setProdutoParaEditar(null);
  };

  const handleDelete = (id: string) => {
    const produtosAtualizados = produtos.filter((produto) => produto.id !== id);
    setProdutos(produtosAtualizados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtosAtualizados));
    toast.success("Produto excluído com sucesso!");
  };

  const handleEdit = (produto: Produto) => {
    setProdutoParaEditar(produto);
    form.reset({
      nome: produto.nome,
      codigo: produto.codigo,
      categoria: produto.categoria,
      quantidade: String(produto.quantidade),
      estoqueMinimo: String(produto.estoqueMinimo),
      preco: String(produto.preco),
    });
    setOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Estoque</h2>
          <p className="text-muted-foreground">Gerencie seus produtos e estoque</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setProdutoParaEditar(null);
              form.reset();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <DialogHeader>
                  <DialogTitle>
                    {produtoParaEditar ? "Editar Produto" : "Adicionar Produto"}
                  </DialogTitle>
                  <DialogDescription>
                    {produtoParaEditar
                      ? "Edite os dados do produto"
                      : "Adicione um novo produto ao estoque"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Produto</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código</FormLabel>
                        <FormControl>
                          <Input placeholder="PRD-XXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                          <Input placeholder="Categoria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estoqueMinimo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque Mínimo</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0,00" {...field} />
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
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Estoque Mínimo</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.codigo}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell>{produto.quantidade}</TableCell>
                  <TableCell>{produto.estoqueMinimo}</TableCell>
                  <TableCell>{formatCurrency(produto.preco)}</TableCell>
                  <TableCell>
                    {isEstoqueBaixo(produto.quantidade, produto.estoqueMinimo) ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Baixo
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Normal</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(produto)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(produto.id)}
                      >
                        Excluir
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

export default Estoque;
