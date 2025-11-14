import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { releasesAPI } from "@/lib/api";

interface Release {
  id: number;
  title: string;
  artist: string;
  format: string;
  imageUrl?: string;
  releaseDate: string;
}

export default function Home() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [latestReleases, setLatestReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  const banners = [
    "/banners/banner1.png",
    "/banners/banner2.png",
    "/banners/banner3.png",
  ];

  // Fetch latest releases
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        const releases = await releasesAPI.getLatest(5);
        setLatestReleases(releases as Release[]);
      } catch (error) {
        console.error("Failed to fetch releases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  // Banner slider animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Banner Slider */}
      <div className="relative w-full h-[500px] overflow-hidden bg-black">
        <div className="relative w-full h-full">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentBannerIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Banner indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentBannerIndex ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Latest Releases Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Latest Releases</h2>
          {loading ? (
            <div className="text-center text-muted-foreground">Loading releases...</div>
          ) : latestReleases.length === 0 ? (
            <div className="text-center text-muted-foreground">No releases available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {latestReleases.map((release) => (
                <Link
                  key={release.id}
                  href={`/releases#release-${release.id}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative w-full aspect-square bg-muted overflow-hidden">
                      {release.imageUrl ? (
                        <img
                          src={release.imageUrl}
                          alt={release.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                          <span className="text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">{release.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{release.artist}</p>
                      <p className="text-xs text-muted-foreground">{release.format}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Founder Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold mb-8 text-center">About Our Founder/CEO</h2>
          <div className="space-y-6 text-center">
            <p className="text-lg leading-relaxed">
              Starmist is the creative force behind MegaVibeNetwork and Starmist Records.
            </p>
            <p className="text-lg leading-relaxed">
              Sturla T Sivertsen, a 40-year-old Norwegian music producer and DJ with over 20 years of experience in production and 10+ years behind the decks.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8 px-4">
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
