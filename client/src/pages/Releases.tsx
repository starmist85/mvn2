import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";
import { ExternalLink, Play } from "lucide-react";
import { useMusicPlayer, type PlaylistTrack } from "@/components/MusicPlayer";

export default function Releases() {
  const { data: releases, isLoading } = trpc.releases.getAll.useQuery();
  const { data: allTracks } = trpc.tracks.getAll.useQuery();
  const { playTrack } = useMusicPlayer();
  const [expandedRelease, setExpandedRelease] = useState<number | null>(null);

  const playReleaseAudio = (release: any) => {
    if (!release.audioPreviewUrl) return;

    const track: PlaylistTrack = {
      id: `release-${release.id}`,
      title: release.title,
      artist: release.artist,
      url: release.audioPreviewUrl,
    };

    playTrack(track);
  };

  const getReleaseTracksCount = (releaseId: number): number => {
    return allTracks?.filter((t: any) => t.releaseId === releaseId).length || 0;
  };

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

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        {release.audioPreviewUrl && (
                          <button
                            onClick={() => playReleaseAudio(release)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Play className="w-4 h-4" /> Play Preview
                          </button>
                        )}
                        {getReleaseTracksCount(release.id) > 0 && (
                          <button
                            onClick={() =>
                              setExpandedRelease(expandedRelease === release.id ? null : release.id)
                            }
                            className="text-sm text-accent hover:underline"
                          >
                            {expandedRelease === release.id ? "Hide Tracks" : `Show Tracks (${getReleaseTracksCount(release.id)})`}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tracks List */}
                  {expandedRelease === release.id && (
                    <div className="border-t border-border px-6 py-4 bg-muted/50">
                      <h3 className="font-bold mb-4">Tracklist</h3>
                      <div className="space-y-2">
                        {allTracks && allTracks.filter((t: any) => t.releaseId === release.id).length > 0 ? (
                          allTracks
                            .filter((t: any) => t.releaseId === release.id)
                            .sort((a: any, b: any) => a.trackNumber - b.trackNumber)
                            .map((track: any) => (
                              <div key={track.id} className="flex items-center justify-between p-3 bg-background rounded">
                                <div className="flex-1">
                                  <p className="font-medium">#{track.trackNumber} {track.title}</p>
                                  <p className="text-sm text-muted-foreground">{track.artist} • {track.length}</p>
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No tracks added yet</p>
                        )}
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
