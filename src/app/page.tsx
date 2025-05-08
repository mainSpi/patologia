
import fs from 'fs/promises';
import path from 'path';
import type { CardData } from '@/types';
import HomePageClient from './HomePageClient'; // New client component
import { Loader2, ServerCrash } from 'lucide-react';

async function getAllCards(): Promise<CardData[] | { error: string }> {
  const cardsDir = path.join(process.cwd(), 'public/data/cards');
  try {
    const filenames = await fs.readdir(cardsDir);
    const cardPromises = filenames
      .filter(filename => filename.endsWith('.json'))
      .map(async filename => {
        const filePath = path.join(cardsDir, filename);
        const fileContents = await fs.readFile(filePath, 'utf-8');
        try {
          return JSON.parse(fileContents) as CardData;
        } catch (parseError) {
          console.error(`Error parsing JSON from ${filename}:`, parseError);
          return null; // Skip malformed JSON files
        }
      });
    const results = await Promise.all(cardPromises);
    return results.filter(card => card !== null) as CardData[];
  } catch (error) {
    console.error("Failed to load cards data directory:", error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unknown error occurred while loading card data." };
  }
}

export default async function HomePage() {
  const cardsResult = await getAllCards();

  if (typeof cardsResult === 'object' && 'error' in cardsResult && cardsResult.error) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center min-h-[calc(100vh-var(--header-height,10rem))]">
        <ServerCrash className="h-12 w-12 text-destructive mb-4" />
        <p className="text-xl font-semibold text-destructive">Error Loading Card Data</p>
        <p className="text-muted-foreground">{cardsResult.error}</p>
        <p className="text-xs text-muted-foreground mt-2">Please try refreshing the page or check the server logs for more details.</p>
      </div>
    );
  }
  
  const cards = cardsResult as CardData[];

  // HomePageClient will handle the "no cards found after filtering" case.
  // This initial "isLoading" is effectively handled by Next.js Server Component rendering.
  // The actual `HomePageClient` will receive `initialCards`.
  return <HomePageClient initialCards={cards} />;
}
