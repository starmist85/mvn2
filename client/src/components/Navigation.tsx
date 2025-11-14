import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={APP_LOGO} alt={APP_TITLE} className="h-12 w-auto" />
          <span className="text-xl font-bold hidden sm:inline">{APP_TITLE}</span>
        </Link>

        {/* Menu Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">
            About
          </Link>
          <Link href="/releases" className="text-sm font-medium hover:text-accent transition-colors">
            Releases
          </Link>
          <Link href="/news" className="text-sm font-medium hover:text-accent transition-colors">
            News
          </Link>
        </div>
      </div>
    </nav>
  );
}
