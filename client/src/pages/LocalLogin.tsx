/**
 * Local Authentication Login Page
 * Username and password based login
 */

import { useState } from "react";
import { useLocalAuth } from "@/_core/hooks/useLocalAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LocalLogin() {
  const [, setLocation] = useLocation();
  const { login, loading, error } = useLocalAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username || !password) {
      setLocalError("Username and password are required");
      return;
    }

    try {
      await login(username, password);
      // Redirect to admin dashboard on successful login
      setLocation("/admin/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setLocalError(message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 border border-border">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-widest">ORACULUM</h1>
            <p className="text-sm text-muted-foreground">PAINEL ADMINISTRATIVO</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm">
                USUÁRIO
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                SENHA
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-background border-border"
              />
            </div>

            {(error || localError) && (
              <div className="p-3 bg-red-950 border border-red-800 text-red-100 text-sm rounded">
                {error || localError}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background hover:bg-foreground/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "ENTRAR"
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground">
            <p>Credenciais padrão:</p>
            <p className="font-mono">admin / alterar_apos_primeiro_login</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
