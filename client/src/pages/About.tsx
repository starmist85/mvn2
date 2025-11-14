import Navigation from "@/components/Navigation";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold mb-12 text-center">About MegaVibeNetwork</h1>

          <div className="space-y-8 text-lg leading-relaxed">
            <p>
              MegaVibeNetwork is the vibrant label branch of Starmist Records, founded by Norwegian producer and DJ Sturla T Sivertsen, known artistically as Starmist. Built from a deep love for timeless grooves and feel-good rhythms, MegaVibeNetwork specializes in vibey, danceable music inspired by the 90s and 2000s era — where melody, emotion, and rhythm meet.
            </p>

            <p>
              The labels mission is to bring back the soulful and energetic essence of classic dance music while embracing the creativity of modern production. Expect a mix of deep house, tech house, bass, and club-ready tracks that move both heart and feet.
            </p>

            <p>
              In addition to digital releases across major platforms, MegaVibeNetwork also offers exclusive vinyl editions for collectors and DJs who appreciate the authentic analog sound.
            </p>

            <p>
              Driven by community and passion, MegaVibeNetwork supports talented producers, vocalists, and remixers from around the world — all united by one goal: to spread good vibes through great music.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8 px-4 mt-16">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2024 MegaVibeNetwork. All rights reserved.</p>
          <Link href="/admin" className="text-xs hover:text-accent transition-colors mt-4 inline-block">
            admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
