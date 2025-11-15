import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
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
  tipoPagamento: z.enum(["imediato", "futuro"], {
    required_error: "Tipo de pagamento é obrigatório",
  }),
  vencimento: z.string().optional(),
}).refine((data) => {
  if (data.tipoPagamento === "futuro") {
    return data.vencimento && data.vencimento.length > 0;
  }
  return true;
}, {
  message: "Data de vencimento é obrigatória para pagamento futuro",
  path: ["vencimento"],
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

interface ItemVenda {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  produtoNome?: string;
}

interface Venda {
  id: string;
  cliente: string;
  data: string;
  total: number;
  tipoPagamento: "imediato" | "futuro";
  vencimento?: string;
  itens: ItemVenda[];
}

const STORAGE_KEY_PRODUTOS = "gestao-flex-pro:produtos";
const STORAGE_KEY_CONTAS_RECEBER = "contasReceber";
const STORAGE_KEY_VENDAS = "gestao-flex-pro:vendas";

const Vendas = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>(() => {
    const storedVendas = localStorage.getItem(STORAGE_KEY_VENDAS);
    return storedVendas ? JSON.parse(storedVendas) : [];
  });
  const [itensVenda, setItensVenda] = useState<ItemVenda[]>([]);
  const [open, setOpen] = useState(false);

  // Carrega produtos do localStorage
  useEffect(() => {
    const storedProdutos = localStorage.getItem(STORAGE_KEY_PRODUTOS);
    if (storedProdutos) {
      setProdutos(JSON.parse(storedProdutos));
    } else {
      // Se não houver produtos, carrega dados mock
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
      setProdutos(mockData);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: "",
      tipoPagamento: "imediato",
      vencimento: "",
    },
  });

  const adicionarItem = () => {
    if (produtos.length === 0) {
      toast.error("Não há produtos disponíveis no estoque");
      return;
    }
    setItensVenda([
      ...itensVenda,
      {
        produtoId: produtos[0].id,
        quantidade: 1,
        precoUnitario: produtos[0].preco,
        subtotal: produtos[0].preco,
      },
    ]);
  };

  const removerItem = (index: number) => {
    setItensVenda(itensVenda.filter((_, i) => i !== index));
  };

  const atualizarItem = (index: number, campo: keyof ItemVenda, valor: string | number) => {
    const novosItens = [...itensVenda];
    const item = novosItens[index];

    if (campo === "produtoId") {
      const produto = produtos.find((p) => p.id === valor);
      if (produto) {
        item.produtoId = produto.id;
        item.precoUnitario = produto.preco;
        item.subtotal = item.quantidade * produto.preco;
      }
    } else if (campo === "quantidade") {
      const qtd = Number(valor);
      const produto = produtos.find((p) => p.id === item.produtoId);
      if (produto && qtd > produto.quantidade) {
        toast.error(`Quantidade disponível: ${produto.quantidade}`);
        return;
      }
      item.quantidade = qtd;
      item.subtotal = qtd * item.precoUnitario;
    }

    setItensVenda(novosItens);
  };

  const calcularTotal = () => {
    return itensVenda.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (itensVenda.length === 0) {
      toast.error("Adicione pelo menos um item à venda");
      return;
    }

    // Valida estoque
    for (const item of itensVenda) {
      const produto = produtos.find((p) => p.id === item.produtoId);
      if (!produto) {
        toast.error(`Produto não encontrado`);
        return;
      }
      if (produto.quantidade < item.quantidade) {
        toast.error(`Estoque insuficiente para ${produto.nome}`);
        return;
      }
    }

    // Atualiza estoque
    const produtosAtualizados = produtos.map((produto) => {
      const itemVenda = itensVenda.find((item) => item.produtoId === produto.id);
      if (itemVenda) {
        const novaQuantidade = produto.quantidade - itemVenda.quantidade;
        // Verifica se ficou com estoque baixo
        if (novaQuantidade < produto.estoqueMinimo && produto.quantidade >= produto.estoqueMinimo) {
          setTimeout(() => {
            toast.error(`⚠️ Estoque baixo: ${produto.nome}`, {
              description: `Quantidade atual: ${novaQuantidade} (mínimo: ${produto.estoqueMinimo})`,
              duration: 5000,
            });
          }, 100);
        }
        return {
          ...produto,
          quantidade: novaQuantidade,
        };
      }
      return produto;
    });
    setProdutos(produtosAtualizados);
    localStorage.setItem(STORAGE_KEY_PRODUTOS, JSON.stringify(produtosAtualizados));

    // Cria a venda
    const novaVenda: Venda = {
      id: String(Date.now()),
      cliente: values.cliente,
      data: new Date().toISOString().split("T")[0],
      total: calcularTotal(),
      tipoPagamento: values.tipoPagamento,
      vencimento: values.tipoPagamento === "futuro" ? values.vencimento : undefined,
      itens: itensVenda.map((item) => {
        const produto = produtos.find((p) => p.id === item.produtoId);
        return {
          ...item,
          produtoNome: produto?.nome || "",
        };
      }),
    };

    setVendas([novaVenda, ...vendas]);
    localStorage.setItem(STORAGE_KEY_VENDAS, JSON.stringify([novaVenda, ...vendas]));

    // Se pagamento futuro, cria conta a receber
    if (values.tipoPagamento === "futuro" && values.vencimento) {
      const contasReceber = JSON.parse(
        localStorage.getItem(STORAGE_KEY_CONTAS_RECEBER) || "[]"
      );
      const novaConta = {
        id: String(Date.now() + 1),
        cliente: values.cliente,
        descricao: `Venda #${novaVenda.id.substring(0, 8)}`,
        valor: calcularTotal(),
        vencimento: values.vencimento,
        status: "pendente",
      };
      contasReceber.push(novaConta);
      localStorage.setItem(STORAGE_KEY_CONTAS_RECEBER, JSON.stringify(contasReceber));
    }

    toast.success("Venda registrada com sucesso!");
    form.reset();
    setItensVenda([]);
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

  const getProdutoNome = (produtoId: string) => {
    return produtos.find((p) => p.id === produtoId)?.nome || "Produto não encontrado";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendas</h2>
          <p className="text-muted-foreground">Registre novas vendas e gerencie seu estoque</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              form.reset();
              setItensVenda([]);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <DialogHeader>
                  <DialogTitle>Nova Venda</DialogTitle>
                  <DialogDescription>
                    Adicione produtos e registre a venda. O estoque será atualizado automaticamente.
                  </DialogDescription>
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipoPagamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Pagamento</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="imediato">Pagamento Imediato</SelectItem>
                              <SelectItem value="futuro">Pagamento Futuro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("tipoPagamento") === "futuro" && (
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
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Itens da Venda</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={adicionarItem}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Item
                      </Button>
                    </div>

                    {itensVenda.length > 0 && (
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Produto</TableHead>
                              <TableHead>Quantidade</TableHead>
                              <TableHead>Preço Unit.</TableHead>
                              <TableHead>Subtotal</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {itensVenda.map((item, index) => {
                              const produto = produtos.find((p) => p.id === item.produtoId);
                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Select
                                      value={item.produtoId}
                                      onValueChange={(value) =>
                                        atualizarItem(index, "produtoId", value)
                                      }
                                    >
                                      <SelectTrigger className="w-[200px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {produtos.map((prod) => (
                                          <SelectItem key={prod.id} value={prod.id}>
                                            {prod.nome} ({prod.quantidade} disponíveis)
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      min="1"
                                      max={produto?.quantidade || 0}
                                      value={item.quantidade}
                                      onChange={(e) =>
                                        atualizarItem(index, "quantidade", e.target.value)
                                      }
                                      className="w-20"
                                    />
                                  </TableCell>
                                  <TableCell>{formatCurrency(item.precoUnitario)}</TableCell>
                                  <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                                  <TableCell>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removerItem(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                        <div className="p-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-xl font-bold text-primary">
                              {formatCurrency(calcularTotal())}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {itensVenda.length === 0 && (
                      <div className="border rounded-md p-8 text-center text-muted-foreground">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum item adicionado. Clique em "Adicionar Item" para começar.</p>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={itensVenda.length === 0}>
                    Registrar Venda
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {vendas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma venda registrada ainda.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pagamento</TableHead>
                  {vendas.some((v) => v.vencimento) && <TableHead>Vencimento</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendas.map((venda) => (
                  <TableRow key={venda.id}>
                    <TableCell>{formatDate(venda.data)}</TableCell>
                    <TableCell className="font-medium">{venda.cliente}</TableCell>
                    <TableCell>
                      {venda.itens.length} {venda.itens.length === 1 ? "item" : "itens"}
                    </TableCell>
                    <TableCell>{formatCurrency(venda.total)}</TableCell>
                    <TableCell>
                      {venda.tipoPagamento === "imediato" ? "Imediato" : "Futuro"}
                    </TableCell>
                    {vendas.some((v) => v.vencimento) && (
                      <TableCell>
                        {venda.vencimento ? formatDate(venda.vencimento) : "-"}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Vendas;

