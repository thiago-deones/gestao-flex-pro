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
import { Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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

const Estoque = () => {
  const [produtos, setProdutos] = useState<Produto[]>(mockData);
  const [open, setOpen] = useState(false);

  const isEstoqueBaixo = (quantidade: number, minimo: number) => {
    return quantidade < minimo;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Produto adicionado com sucesso!");
    setOpen(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Adicionar Produto</DialogTitle>
                <DialogDescription>Adicione um novo produto ao estoque</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome do Produto</Label>
                  <Input id="nome" placeholder="Nome do produto" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input id="codigo" placeholder="PRD-XXX" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input id="categoria" placeholder="Categoria" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input id="quantidade" type="number" placeholder="0" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                  <Input id="estoqueMinimo" type="number" placeholder="0" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="preco">Preço</Label>
                  <Input id="preco" type="number" step="0.01" placeholder="0,00" required />
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
