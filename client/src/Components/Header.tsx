import { Link } from "wouter";

export default function Header() {
  return (
    <header className="border-b border-border bg-background py-12">
      <div className="container">
        {/* Centered Title */}
        <Link href="/" className="flex flex-col items-center justify-center text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-light tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors">
            Oraculum
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground tracking-widest uppercase mt-3">
            Arquivo Literário Digital
          </p>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center justify-center gap-6 mb-8">
          <Link href="/" className="text-sm font-light tracking-wide uppercase text-foreground hover:text-muted-foreground transition-colors">
            Textos
          </Link>
        </nav>

        {/* Separator */}
        <div className="border-t border-border"></div>
      </div>
    </header>
  );
}
