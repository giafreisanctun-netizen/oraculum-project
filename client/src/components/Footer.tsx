export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 mt-16">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground tracking-wide">
            © {new Date().getFullYear()} Oraculum — Arquivo Literário Digital
          </p>
          <p className="text-xs text-muted-foreground tracking-wide">
            Contemplação. Silêncio. Texto.
          </p>
        </div>
      </div>
    </footer>
  );
}
