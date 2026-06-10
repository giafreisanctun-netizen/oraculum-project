import { Link } from "wouter";
import type { Post } from "@shared/types";

interface TextCardProps {
  post: Post;
}

export default function TextCard({ post }: TextCardProps) {
  const dateOriginal = new Date(post.dateOriginal);
  const dateFormatted = dateOriginal.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link href={`/texto/${post.id}`}>
      <article className="archive-card cursor-pointer group">
        {/* Content - Full display */}
        <div className="text-content mb-6 leading-relaxed">
          <p className="text-base text-foreground group-hover:text-muted-foreground transition-colors whitespace-pre-wrap">
            "{post.content}"
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <time className="metadata">
            {dateFormatted}
          </time>
          <span className="text-xs text-muted-foreground tracking-wide uppercase">
            Ler →
          </span>
        </div>
      </article>
    </Link>
  );
}
