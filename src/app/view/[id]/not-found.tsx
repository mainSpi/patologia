import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="h-24 w-24 text-destructive mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-4">404 - Card Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Oops! The card you are looking for does not exist or may have been moved.
        </p>
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back to Explorer
          </Link>
        </Button>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} Card Explorer. All rights reserved.</p>
      </footer>
    </div>
  );
}
