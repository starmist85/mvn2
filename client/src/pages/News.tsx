import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function News() {
  const { data: news, isLoading } = trpc.news.getAll.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold mb-12 text-center">News</h1>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          ) : news && news.length > 0 ? (
            <div className="space-y-8">
              {news.map((article) => (
                <article
                  key={article.id}
                  className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* Article Image */}
                  {article.imageUrl && (
                    <div className="w-full h-64 overflow-hidden bg-muted">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="text-3xl font-bold mb-2">{article.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {new Date(article.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {article.excerpt && (
                      <p className="text-base leading-relaxed mb-4 text-muted-foreground">
                        {article.excerpt}
                      </p>
                    )}

                    {article.content && (
                      <div className="prose prose-invert max-w-none">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {article.content}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No news articles yet. Check back soon!</p>
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
