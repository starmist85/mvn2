import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus } from "lucide-react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";

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

export default function Admin() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not admin
  if (!loading && (!user || user.role !== "admin")) {
    navigate("/");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
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
  const { data: releases } = trpc.releases.getAll.useQuery();
  const createMutation = trpc.releases.create.useMutation();
  const deleteMutation = trpc.releases.delete.useMutation();

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    releaseDate: new Date().toISOString().split("T")[0],
    description: "",
    format: "Digital Album" as "Digital Album" | "Digital Single" | "Digital USB Stick" | "CD Single" | "CD Album" | "Vinyl Album" | "Vinyl Single" | "Cassette",
    imageUrl: "",
    audioPreviewUrl: "",
    youtubeLink: "",
    spotifyLink: "",
    appleMusicLink: "",
    storeLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        artist: formData.artist,
        releaseDate: new Date(formData.releaseDate),
        description: formData.description,
        format: formData.format as "Digital Album" | "Digital Single" | "Digital USB Stick" | "CD Single" | "CD Album" | "Vinyl Album" | "Vinyl Single" | "Cassette",
        imageUrl: formData.imageUrl,
        audioPreviewUrl: formData.audioPreviewUrl,
        youtubeLink: formData.youtubeLink,
        spotifyLink: formData.spotifyLink,
        appleMusicLink: formData.appleMusicLink,
        storeLink: formData.storeLink,
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
    } catch (error) {
      console.error("Failed to create release:", error);
    }
  };

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
            <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value as "Digital Album" | "Digital Single" | "Digital USB Stick" | "CD Single" | "CD Album" | "Vinyl Album" | "Vinyl Single" | "Cassette" })}>
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
            <Input
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <Input
              placeholder="Audio Preview URL"
              value={formData.audioPreviewUrl}
              onChange={(e) => setFormData({ ...formData, audioPreviewUrl: e.target.value })}
            />
            <Input
              placeholder="YouTube Link"
              value={formData.youtubeLink}
              onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
            />
            <Input
              placeholder="Spotify Link"
              value={formData.spotifyLink}
              onChange={(e) => setFormData({ ...formData, spotifyLink: e.target.value })}
            />
            <Input
              placeholder="Apple Music Link"
              value={formData.appleMusicLink}
              onChange={(e) => setFormData({ ...formData, appleMusicLink: e.target.value })}
            />
            <Input
              placeholder="Store Link"
              value={formData.storeLink}
              onChange={(e) => setFormData({ ...formData, storeLink: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Release"}
          </Button>
        </form>
      </Card>

      {/* Releases List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Releases</h2>
        <div className="space-y-4">
          {releases?.map((release) => (
            <Card key={release.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold">{release.title}</h3>
                <p className="text-sm text-muted-foreground">{release.artist} • {release.format}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(release.id)}
                disabled={deleteMutation.isPending}
              >
                <X className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsManager() {
  const { data: news } = trpc.news.getAll.useQuery();
  const createMutation = trpc.news.create.useMutation();
  const deleteMutation = trpc.news.delete.useMutation();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    publishedAt: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        ...formData,
        publishedAt: new Date(formData.publishedAt),
      });
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        publishedAt: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Failed to create news:", error);
    }
  };

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
            <Input
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <Input
              type="date"
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Publishing..." : "Publish Article"}
          </Button>
        </form>
      </Card>

      {/* News List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Published Articles</h2>
        <div className="space-y-4">
          {news?.map((article) => (
            <Card key={article.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold">{article.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(article.id)}
                disabled={deleteMutation.isPending}
              >
                <X className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
