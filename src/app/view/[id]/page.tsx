import type { CardData } from '@/types';
import SVSViewer from '@/components/SVSViewer';
// AppHeader is now in RootLayout
import { Badge } from '@/components/ui/badge';
import { Tag, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getCardData(id: string): Promise<CardData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'; 
    const res = await fetch(`${baseUrl}/data/cards.json`, { cache: 'no-store' }); 
    if (!res.ok) {
      console.error("Failed to fetch cards.json:", res.status, res.statusText);
      return null;
    }
    const cards: CardData[] = await res.json();
    const card = cards.find(c => c.id === id);
    return card || null;
  } catch (error) {
    console.error("Error fetching card data:", error);
    return null;
  }
}


export async function generateMetadata({ params }: { params: { id: string } }) {
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


export default async function ViewPage({ params }: { params: { id: string } }) {
  const card = await getCardData(params.id);

  if (!card) {
    notFound();
  }
  
  const tileSourceOptions = {
    type: 'image',
    url: card.svsUrl,
  };


  return (
    <div className="container mx-auto px-4 py-8"> {/* Changed from main tag to div, removed flex-grow */}
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
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    const res = await fetch(`${baseUrl}/data/cards.json`);
     if (!res.ok) {
      console.error("Failed to fetch cards.json for static params:", res.status, res.statusText);
      return [];
    }
    const cards: CardData[] = await res.json();
    return cards.map((card) => ({
      id: card.id,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}
