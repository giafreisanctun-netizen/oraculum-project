import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function TextPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const postId = parseInt(params.id || "0", 10);

  // Fetch current post
  const { data: post, isLoading } = trpc.posts.getById.useQuery(postId);

  // Fetch all posts to enable navigation
  const { data: allPosts } = trpc.posts.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-96">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground mb-6">Texto não encontrado.</p>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="text-xs uppercase tracking-wide"
          >
            ← Voltar para listagem
          </Button>
        </div>
      </div>
    );
  }

  // Find navigation posts
  const currentIndex = allPosts?.findIndex((p) => p.id === post.id) ?? -1;
  const previousPost = currentIndex > 0 ? allPosts?.[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < (allPosts?.length ?? 0) - 1
    ? allPosts?.[currentIndex + 1]
    : null;

  const dateOriginal = new Date(post.dateOriginal);
  const dateFormatted = dateOriginal.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 text-xs uppercase tracking-wide"
        >
          ← Voltar
        </Button>

        {/* Main content */}
        <article className="mb-12">
          {/* Metadata */}
          <div className="mb-8 pb-6 border-b border-border">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                Escrito em: {dateFormatted}
              </p>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                Publicado em: {new Date(post.datePublished).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Text content */}
          <div className="text-content mb-8 leading-relaxed">
            <p className="text-base text-foreground whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Separator */}
          <div className="my-12 border-t border-border"></div>
        </article>

        {/* Navigation */}
        {(previousPost || nextPost) && (
          <div className="flex items-center justify-between gap-4 pt-8">
            {previousPost ? (
              <Button
                variant="outline"
                onClick={() => navigate(`/texto/${previousPost.id}`)}
                className="flex-1 text-xs uppercase tracking-wide"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            ) : (
              <div className="flex-1"></div>
            )}

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="text-xs uppercase tracking-wide"
            >
              Listagem
            </Button>

            {nextPost ? (
              <Button
                variant="outline"
                onClick={() => navigate(`/texto/${nextPost.id}`)}
                className="flex-1 text-xs uppercase tracking-wide"
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div className="flex-1"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
