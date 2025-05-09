
import fs from 'fs/promises';
import path from 'path';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import type { CardData } from '@/types';
import SVSViewer from '@/components/SVSViewer';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface CardViewPageProps {
  params: Promise<{ id: string }>;
}

async function getCardData(id: string): Promise<CardData | null> {
  const cardsDir = path.join(process.cwd(), 'public/data/cards');
  const filePath = path.join(cardsDir, `${id}.json`);
  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContents) as CardData;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return null; 
    }
    console.error(`Failed to load card data for ID ${id}:`, error);
    // For other errors, we might want to throw or handle differently,
    // but for now, returning null will lead to a 404.
    return null;
  }
}

export async function generateMetadata(props: CardViewPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
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

export default async function CardViewPage(props: CardViewPageProps) {
  const params = await props.params;
  // Fetch card data within the Server Component
  const card = await getCardData(params.id);

  if (!card) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explorer
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <SVSViewer tileSource={card.svsUrl} viewerId={`svs-viewer-${card.id}`} />
        </div>

        <div className="md:col-span-1">
          <div className="bg-card p-6 rounded-lg shadow-xl sticky top-20">
            <div className="relative w-full h-40 rounded-md overflow-hidden mb-4 shadow-inner">
              <Image
                src={card.imageUrl}
                alt={`Preview of ${card.title}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-3">{card.title}</h1>
            <p className="text-muted-foreground mb-4 text-sm">{card.description}</p>
            
            {card.tags && card.tags.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-secondary-foreground mb-2 flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-muted-foreground" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
             <p className="text-xs text-muted-foreground mt-6">ID: {card.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const cardsDir = path.join(process.cwd(), 'public/data/cards');
  try {
    const filenames = await fs.readdir(cardsDir);
    return filenames
      .filter(filename => filename.endsWith('.json'))
      .map(filename => ({
        id: filename.replace('.json', ''),
      }));
  } catch (error) {
    console.warn("Could not read cards directory for generateStaticParams. This is normal if no cards exist yet.", error);
    return [];
  }
}
