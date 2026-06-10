import { Link } from "wouter";

export default function Header({ user, setUser }: any) {
  async function handleLogout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  setUser(null);
  }
  
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

  {!user ? (
    <Link
      href="/admin"
      className="text-sm font-light tracking-wide uppercase text-foreground hover:text-muted-foreground transition-colors"
    >
      Login
    </Link>
  ) : (
    <>
      <Link
        href="/admin/dashboard"
        className="text-sm font-light tracking-wide uppercase text-foreground hover:text-muted-foreground transition-colors"
      >
        Dashboard
      </Link>

      <button
        onClick={handleLogout}
        className="text-sm font-light tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
      >
        Logout
      </button>
    </>
  )}
</nav>

        {/* Separator */}
        <div className="border-t border-border"></div>
      </div>
    </header>
  );
}
