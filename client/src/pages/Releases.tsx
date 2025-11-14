import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

export default function Releases() {
  const { data: releases, isLoading } = trpc.releases.getAll.useQuery();
  const { data: tracksMap } = trpc.tracks.getByReleaseId.useQuery(0);
  const [expandedRelease, setExpandedRelease] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-center">Releases</h1>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading releases...</p>
            </div>
          ) : releases && releases.length > 0 ? (
            <div className="space-y-8">
              {releases.map((release) => (
                <div
                  key={release.id}
                  id={`release-${release.id}`}
                  className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {/* Release Image */}
                    <div className="md:col-span-1">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        {release.imageUrl ? (
                          <img
                            src={release.imageUrl}
                            alt={release.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                            <span className="text-muted-foreground">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Release Details */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">{release.title}</h2>
                        <p className="text-lg text-muted-foreground mb-1">{release.artist}</p>
                        <p className="text-sm text-muted-foreground">
                          {release.format} • {new Date(release.releaseDate).toLocaleDateString()}
                        </p>
                      </div>

                      {release.description && (
                        <p className="text-sm leading-relaxed">{release.description}</p>
                      )}

                      {/* Links */}
                      <div className="flex flex-wrap gap-3 pt-4">
                        {release.spotifyLink && (
                          <a
                            href={release.spotifyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            Spotify <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {release.appleMusicLink && (
                          <a
                            href={release.appleMusicLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            Apple Music <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {release.youtubeLink && (
                          <a
                            href={release.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            YouTube <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {release.storeLink && (
                          <a
                            href={release.storeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            Store <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* Expand Tracks Button */}
                      <button
                        onClick={() =>
                          setExpandedRelease(expandedRelease === release.id ? null : release.id)
                        }
                        className="text-sm text-accent hover:underline"
                      >
                        {expandedRelease === release.id ? "Hide Tracks" : "Show Tracks"}
                      </button>
                    </div>
                  </div>

                  {/* Tracks List */}
                  {expandedRelease === release.id && (
                    <div className="border-t border-border px-6 py-4 bg-muted/50">
                      <h3 className="font-bold mb-4">Tracklist</h3>
                      <div className="space-y-2">
                        {/* Placeholder for tracks - will be populated by admin */}
                        <p className="text-sm text-muted-foreground">Tracks will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No releases yet. Check back soon!</p>
            </div>
          )}
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
