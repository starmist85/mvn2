import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";
import { releasesAPI, tracksAPI, newsAPI } from "@/lib/api";

const RELEASE_FORMATS = [
  "Digital Album",
  "Digital Single",
  "Digital USB Stick",
  "CD Single",
  "CD Album",
  "Vinyl Album",
  "Vinyl Single",
  "Cassette",
];

interface Release {
  id: number;
  title: string;
  artist: string;
  format: string;
  description?: string;
  imageUrl?: string;
  audioPreviewUrl?: string;
  releaseDate: string;
  youtubeLink?: string;
  spotifyLink?: string;
  appleMusicLink?: string;
  storeLink?: string;
}

interface Track {
  id: number;
  releaseId: number;
  trackNumber: number;
  title: string;
  artist: string;
  length: string;
}

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  publishDate: string;
}

export default function Admin() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not admin using useEffect to avoid render-time state updates
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-8 px-4 pb-32">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

          <Tabs defaultValue="releases" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="releases">Releases</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>

            {/* Releases Tab */}
            <TabsContent value="releases" className="space-y-8">
              <ReleaseManager />
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news" className="space-y-8">
              <NewsManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function ReleaseManager() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedReleaseId, setExpandedReleaseId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    releaseDate: new Date().toISOString().split("T")[0],
    description: "",
    format: "Digital Album",
    imageUrl: "",
    audioPreviewUrl: "",
    youtubeLink: "",
    spotifyLink: "",
    appleMusicLink: "",
    storeLink: "",
  });

  const [trackFormData, setTrackFormData] = useState({
    artist: "",
    title: "",
    length: "",
    trackNumber: 1,
  });

  const [selectedReleaseForTrack, setSelectedReleaseForTrack] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingTrack, setIsAddingTrack] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingTrack, setIsDeletingTrack] = useState(false);

  // Fetch releases and tracks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [releasesData, tracksData] = await Promise.all([
          releasesAPI.getAll(),
          tracksAPI.getAll(),
        ]);
        setReleases(releasesData as Release[]);
        setTracks(tracksData as Track[]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load releases and tracks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      await releasesAPI.create({
        ...formData,
        releaseDate: new Date(formData.releaseDate),
      });
      setFormData({
        title: "",
        artist: "",
        releaseDate: new Date().toISOString().split("T")[0],
        description: "",
        format: "Digital Album",
        imageUrl: "",
        audioPreviewUrl: "",
        youtubeLink: "",
        spotifyLink: "",
        appleMusicLink: "",
        storeLink: "",
      });
      toast.success("Release created successfully!");
      // Refresh releases
      const updatedReleases = await releasesAPI.getAll();
      setReleases(updatedReleases as Release[]);
    } catch (error) {
      console.error("Failed to create release:", error);
      toast.error("Failed to create release");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReleaseForTrack) {
      toast.error("Please select a release");
      return;
    }

    try {
      setIsAddingTrack(true);
      const nextTrackNumber = (getReleaseTracks(selectedReleaseForTrack).length || 0) + 1;
      await tracksAPI.create({
        releaseId: selectedReleaseForTrack,
        trackNumber: nextTrackNumber,
        artist: trackFormData.artist,
        title: trackFormData.title,
        length: trackFormData.length,
      });
      setTrackFormData({
        artist: "",
        title: "",
        length: "",
        trackNumber: 1,
      });
      toast.success("Track added successfully!");
      // Refresh tracks
      const updatedTracks = await tracksAPI.getAll();
      setTracks(updatedTracks as Track[]);
    } catch (error) {
      console.error("Failed to add track:", error);
      toast.error("Failed to add track");
    } finally {
      setIsAddingTrack(false);
    }
  };

  const handleDeleteRelease = async (releaseId: number) => {
    try {
      setIsDeleting(true);
      await releasesAPI.delete(releaseId);
      toast.success("Release deleted successfully!");
      // Refresh releases
      const updatedReleases = await releasesAPI.getAll();
      setReleases(updatedReleases as Release[]);
    } catch (error) {
      console.error("Failed to delete release:", error);
      toast.error("Failed to delete release");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteTrack = async (trackId: number) => {
    try {
      setIsDeletingTrack(true);
      await tracksAPI.delete(trackId);
      toast.success("Track deleted successfully!");
      // Refresh tracks
      const updatedTracks = await tracksAPI.getAll();
      setTracks(updatedTracks as Track[]);
    } catch (error) {
      console.error("Failed to delete track:", error);
      toast.error("Failed to delete track");
    } finally {
      setIsDeletingTrack(false);
    }
  };

  const getReleaseTracksCount = (releaseId: number): number => {
    return tracks.filter((t) => t.releaseId === releaseId).length;
  };

  const getReleaseTracks = (releaseId: number): Track[] => {
    return tracks.filter((t) => t.releaseId === releaseId);
  };

  if (isLoading) {
    return <div className="text-center py-12"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="space-y-8">
      {/* Create Release Form */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Release</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Release Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              placeholder="Artist Name"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              required
            />
            <Input
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              required
            />
            <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RELEASE_FORMATS.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Release Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUpload
              fileType="image"
              label="Release Cover Image"
              currentUrl={formData.imageUrl}
              onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
            />
            <FileUpload
              fileType="audio"
              label="Audio Preview"
              currentUrl={formData.audioPreviewUrl}
              onUploadComplete={(url) => setFormData({ ...formData, audioPreviewUrl: url })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">YouTube Link</label>
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={formData.youtubeLink}
                onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Spotify Link</label>
              <Input
                placeholder="https://spotify.com/album/..."
                value={formData.spotifyLink}
                onChange={(e) => setFormData({ ...formData, spotifyLink: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Apple Music Link</label>
              <Input
                placeholder="https://music.apple.com/..."
                value={formData.appleMusicLink}
                onChange={(e) => setFormData({ ...formData, appleMusicLink: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Store Link</label>
              <Input
                placeholder="https://store.example.com/..."
                value={formData.storeLink}
                onChange={(e) => setFormData({ ...formData, storeLink: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Release"}
          </Button>
        </form>
      </Card>

      {/* Add Tracks Form */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Add Track to Release</h2>
        <form onSubmit={handleAddTrack} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Release</label>
            <Select value={selectedReleaseForTrack?.toString() || ""} onValueChange={(value) => setSelectedReleaseForTrack(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a release..." />
              </SelectTrigger>
              <SelectContent>
                {releases.map((release) => (
                  <SelectItem key={release.id} value={release.id.toString()}>
                    {release.title} - {release.artist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Track Artist"
              value={trackFormData.artist}
              onChange={(e) => setTrackFormData({ ...trackFormData, artist: e.target.value })}
              required
            />
            <Input
              placeholder="Track Title"
              value={trackFormData.title}
              onChange={(e) => setTrackFormData({ ...trackFormData, title: e.target.value })}
              required
            />
            <Input
              placeholder="Length (e.g., 3:45)"
              value={trackFormData.length}
              onChange={(e) => setTrackFormData({ ...trackFormData, length: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isAddingTrack}>
            {isAddingTrack ? "Adding..." : "Add Track"}
          </Button>
        </form>
      </Card>

      {/* Releases List with Tracks */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Releases</h2>
        <div className="space-y-4">
          {releases.map((release) => {
            const releaseTracks = getReleaseTracks(release.id);
            const isExpanded = expandedReleaseId === release.id;

            return (
              <Card key={release.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedReleaseId(isExpanded ? null : release.id)}>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{release.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {release.artist} • {release.format} • {releaseTracks.length} track{releaseTracks.length !== 1 ? "s" : ""}
                      </p>
                      {release.imageUrl && (
                        <p className="text-xs text-muted-foreground mt-1">Image: {release.imageUrl.substring(0, 50)}...</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRelease(release.id);
                        }}
                        disabled={isDeleting}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Expanded Tracks View */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <h4 className="font-semibold">Tracks ({releaseTracks.length})</h4>
                      {releaseTracks.length > 0 ? (
                        <div className="space-y-2">
                          {releaseTracks.map((track) => (
                            <div key={track.id} className="flex items-center justify-between p-3 bg-muted rounded">
                              <div className="flex-1">
                                <p className="font-medium">#{track.trackNumber} {track.title}</p>
                                <p className="text-sm text-muted-foreground">{track.artist} • {track.length}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTrack(track.id)}
                                disabled={isDeletingTrack}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No tracks added yet</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NewsManager() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    publishDate: new Date().toISOString().split("T")[0],
  });

  // Fetch news articles
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const articles = await newsAPI.getAll();
        setNews(articles as NewsArticle[]);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        toast.error("Failed to load news articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      await newsAPI.create({
        ...formData,
        publishDate: new Date(formData.publishDate),
      });
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        publishDate: new Date().toISOString().split("T")[0],
      });
      toast.success("News article published successfully!");
      // Refresh news
      const updatedNews = await newsAPI.getAll();
      setNews(updatedNews as NewsArticle[]);
    } catch (error) {
      console.error("Failed to create news:", error);
      toast.error("Failed to publish article");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNews = async (newsId: number) => {
    try {
      setIsDeleting(true);
      await newsAPI.delete(newsId);
      toast.success("Article deleted successfully!");
      // Refresh news
      const updatedNews = await newsAPI.getAll();
      setNews(updatedNews as NewsArticle[]);
    } catch (error) {
      console.error("Failed to delete news:", error);
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="space-y-8">
      {/* Create News Form */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Create News Article</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Article Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            placeholder="Article Excerpt (short summary)"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
          />

          <Textarea
            placeholder="Full Article Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUpload
              fileType="image"
              label="Article Image"
              currentUrl={formData.imageUrl}
              onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Publish Date</label>
              <Input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? "Publishing..." : "Publish Article"}
          </Button>
        </form>
      </Card>

      {/* News List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Published Articles</h2>
        <div className="space-y-4">
          {news.map((article) => (
            <Card key={article.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(article.publishDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm mb-2">{article.excerpt}</p>
                  {article.imageUrl && (
                    <p className="text-xs text-muted-foreground">Image: {article.imageUrl.substring(0, 50)}...</p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteNews(article.id)}
                  disabled={isDeleting}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
