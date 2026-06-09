import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TextPage from "./pages/TextPage";
import LocalLogin from "./pages/LocalLogin";
import AdminDashboard from "./pages/AdminDashboard";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/texto/:id" component={TextPage} />
          <Route path="/admin" component={LocalLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/404" component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
