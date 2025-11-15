import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vendas from "./pages/Vendas";
import ContasPagar from "./pages/ContasPagar";
import ContasReceber from "./pages/ContasReceber";
import Estoque from "./pages/Estoque";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendas"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Vendas />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contas-pagar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ContasPagar />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contas-receber"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ContasReceber />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/estoque"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Estoque />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
