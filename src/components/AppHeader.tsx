import Link from 'next/link';
import { Microscope } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <Microscope className="h-8 w-8" />
          <span>Card Explorer</span>
        </Link>
        {/* Add navigation or user profile links here if needed */}
      </div>
    </header>
  );
};

export default AppHeader;
