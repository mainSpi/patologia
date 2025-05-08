
import fs from 'fs/promises';
import path from 'path';
import type { CardData } from '@/types';
import SVSViewer from '@/components/SVSViewer';
import { Badge } from '@/components/ui/badge';
import { Tag, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getCardData(id: string): Promise<CardData | null> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'cards', `${id}.json`);
  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContents) as CardData;
  } catch (error) {
    // console.error(`Failed to get card data for ${id}:`, error); // Log on server
    // Check if the error is because the file doesn't exist
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        // File not found specifically
    } else {
        // Other errors (e.g., parsing, permissions)
        console.error(`Error reading or parsing card file ${id}.json:`, error);
    }
    return null;
  }
}

// Updated signature and usage for params
export async function generateMetadata({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise; // Await the params promise
  const card = await getCardData(params.id);
  if (!card) {
    return {
      title: 'Card Not Found',
    };
  }
  return {
    title: `${card.title} - Card Explorer`,
    description: card.description,
  };
}

// Updated signature and usage for params
export default async function ViewPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise; // Await the params promise
  const card = await getCardData(params.id);

  if (!card) {
    notFound();
  }
  
  const tileSourceOptions = {
    type: 'image',
    url: card.svsUrl,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explorer
          </Link>
        </Button>
      </div>
      <div className="bg-card p-6 rounded-lg shadow-xl mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">{card.title}</h1>
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <Tag className="h-5 w-5 text-accent mr-1" />
          {card.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <p className="text-muted-foreground flex items-start">
          <Info className="h-5 w-5 text-accent mr-2 mt-1 shrink-0" />
          <span>{card.description}</span>
        </p>
      </div>
      
      <SVSViewer viewerId={`openseadragon-viewer-${card.id}`} tileSource={tileSourceOptions} />
      
    </div>
  );
}

export async function generateStaticParams() {
  const cardsDir = path.join(process.cwd(), 'public', 'data', 'cards');
  try {
    const filenames = await fs.readdir(cardsDir);
    return filenames
      .filter(filename => filename.endsWith('.json'))
      .map(filename => ({
        id: filename.replace('.json', ''),
      }));
  } catch (error) {
    console.error("Error generating static params for card view pages:", error);
    return [];
  }
}

