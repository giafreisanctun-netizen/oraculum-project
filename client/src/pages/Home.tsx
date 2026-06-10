import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import TextCard from "@/components/TextCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const POSTS_PER_PAGE = 12;

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all posts
  const { data: posts, isLoading } = trpc.posts.getAll.useQuery();

  // Paginate posts
  const paginatedData = useMemo(() => {
    if (!posts) return { posts: [], totalPages: 0 };

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    const endIdx = startIdx + POSTS_PER_PAGE;

    return {
      posts: posts.slice(startIdx, endIdx),
      totalPages,
      totalPosts: posts.length,
    };
  }, [posts, currentPage]);

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-96">
        <Spinner />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground">Nenhum texto publicado ainda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        {/* Posts Grid */}
        <div className="space-y-6 mb-12">
          {paginatedData.posts.map((post) => (
            <TextCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        {paginatedData.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-xs uppercase tracking-wide"
            >
              ← Anterior
            </Button>

            <div className="text-xs text-muted-foreground tracking-wide">
              Página {currentPage} de {paginatedData.totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(paginatedData.totalPages, p + 1))
              }
              disabled={currentPage === paginatedData.totalPages}
              className="text-xs uppercase tracking-wide"
            >
              Próximo →
            </Button>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground tracking-wide">
            {paginatedData.totalPosts} texto{paginatedData.totalPosts !== 1 ? "s" : ""} no arquivo
          </p>
        </div>
      </div>
    </div>
  );
}
