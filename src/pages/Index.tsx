import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Brain, FileText, History } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export default function Index() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar user={user} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              AI-Powered Productivity
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Boost your productivity with AI assistance. Manage notes, get intelligent responses, and track your conversations - all in one beautiful interface.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to={user ? "/dashboard" : "/auth"}>
                <Button variant="hero" size="lg" className="text-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all hover:scale-105">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-muted-foreground">
              Get intelligent responses powered by advanced AI models for any question or task.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all hover:scale-105">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Notes & Tasks</h3>
            <p className="text-muted-foreground">
              Organize your thoughts with a powerful note-taking system that keeps everything in sync.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all hover:scale-105">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <History className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Conversation History</h3>
            <p className="text-muted-foreground">
              Never lose track of your AI interactions with automatic conversation history.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
