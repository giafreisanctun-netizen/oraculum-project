import { useState } from "react";
import { useLocation } from "wouter";
import { useLocalAuth } from "@/_core/hooks/useLocalAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Trash2, Edit2 } from "lucide-react";
import type { Post } from "@shared/types";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading, logout, isAuthenticated } = useLocalAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({ content: "", dateOriginal: "" });

  // Fetch posts
  const { data: posts, isLoading, refetch } = trpc.posts.getAll.useQuery();

  // Mutations
  const createMutation = trpc.posts.create.useMutation({
    onSuccess: () => {
      toast.success("Texto criado com sucesso");
      setFormData({ content: "", dateOriginal: "" });
      setIsCreateOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar texto");
    },
  });

  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: () => {
      toast.success("Texto atualizado com sucesso");
      setEditingPost(null);
      setFormData({ content: "", dateOriginal: "" });
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar texto");
    },
  });

  const deleteMutation = trpc.posts.delete.useMutation({
    onSuccess: () => {
      toast.success("Texto deletado com sucesso");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao deletar texto");
    },
  });

  // Check authorization
  if (authLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-96">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    navigate("/admin");
    return null;
  }

  const handleCreate = () => {
    if (!formData.content.trim() || !formData.dateOriginal) {
      toast.error("Preencha todos os campos");
      return;
    }
    createMutation.mutate({
      content: formData.content,
      dateOriginal: formData.dateOriginal,
    });
  };

  const handleUpdate = () => {
    if (!editingPost || !formData.content.trim() || !formData.dateOriginal) {
      toast.error("Preencha todos os campos");
      return;
    }
    updateMutation.mutate({
      id: editingPost.id,
      content: formData.content,
      dateOriginal: formData.dateOriginal,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este texto?")) {
      deleteMutation.mutate(id);
    }
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    const dateStr = new Date(post.dateOriginal).toISOString().split("T")[0];
    setFormData({
      content: post.content,
      dateOriginal: dateStr,
    });
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <h1 className="text-3xl font-light tracking-wide uppercase">
            Painel Administrativo
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="text-xs uppercase tracking-wide"
          >
            Sair
          </Button>
        </div>

        {/* Create button */}
        <Button
          onClick={() => {
            setEditingPost(null);
            setFormData({ content: "", dateOriginal: "" });
            setIsCreateOpen(true);
          }}
          className="mb-8 text-xs uppercase tracking-wide"
        >
          + Novo Texto
        </Button>

        {/* Posts list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="archive-card flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-2 mb-2">
                    "{post.content.substring(0, 100)}..."
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.dateOriginal).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(post)}
                    className="text-xs"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-xs text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum texto publicado ainda.</p>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateOpen || !!editingPost} onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingPost(null);
            setFormData({ content: "", dateOriginal: "" });
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-light tracking-wide uppercase">
                {editingPost ? "Editar Texto" : "Criar Novo Texto"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-light tracking-wide uppercase mb-2 block">
                  Data Original
                </label>
                <Input
                  type="date"
                  value={formData.dateOriginal}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOriginal: e.target.value })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-sm font-light tracking-wide uppercase mb-2 block">
                  Conteúdo
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Digite o texto aqui..."
                  className="min-h-64 text-sm"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingPost(null);
                    setFormData({ content: "", dateOriginal: "" });
                  }}
                  className="flex-1 text-xs uppercase tracking-wide"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={editingPost ? handleUpdate : handleCreate}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 text-xs uppercase tracking-wide"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Spinner className="w-4 h-4 mr-2" />
                  ) : null}
                  {editingPost ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
