
'use client';

import type { CardData } from '@/types';
import { useEffect, useState, useMemo } from 'react';
import CardItem from '@/components/CardItem';
import { Input } from '@/components/ui/input';
import { Search, Loader2, ServerCrash, Tag } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch('/data/cards.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch card data: ${response.statusText}`);
        }
        const data: CardData[] = await response.json();
        setCards(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCards = useMemo(() => {
    const cleanedSearchTerm = searchTerm.trim().toLowerCase();
    if (!cleanedSearchTerm) return cards;

    const searchTagsArray = cleanedSearchTerm.split(/\s+/).filter(t => t.length > 0);
    if (searchTagsArray.length === 0) return cards;

    return cards.filter(card => {
      const cardTagsLower = card.tags.map(t => t.toLowerCase());
      return searchTagsArray.every(searchTag =>
        cardTagsLower.some(cardTag => cardTag.includes(searchTag))
      );
    });
  }, [cards, searchTerm]);

  const commonTags = useMemo(() => {
    if (!cards.length) return [];
    const tagCounts: Record<string, number> = {};
    cards.forEach(card => {
      card.tags.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        tagCounts[lowerTag] = (tagCounts[lowerTag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 12) // Display top 12 common tags
      .map(([tag]) => tag);
  }, [cards]);

  const handleCommonTagClick = (tag: string) => {
    setSearchTerm(prevSearchTerm => {
      const terms = prevSearchTerm.trim().toLowerCase().split(/\s+/).filter(t => t.length > 0);
      if (terms.includes(tag.toLowerCase())) {
        // If tag is already in search, remove it (toggle behavior)
        return terms.filter(t => t !== tag.toLowerCase()).join(' ');
      }
      // If tag is not in search, add it
      if (prevSearchTerm.trim() === '') {
        return tag;
      }
      return `${prevSearchTerm.trim()} ${tag}`;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 sticky top-[calc(3.5rem+1px)] md:top-[calc(4rem+1px)] bg-background py-4 z-30 shadow-sm -mx-4 px-4">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by tags (e.g., biology tissue)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-full text-base border-2 focus:border-primary transition-colors"
              aria-label="Search cards by tags"
            />
          </div>
          {commonTags.length > 0 && !isLoading && (
            <div className="max-w-3xl mx-auto mt-3">
              <div className="flex flex-wrap gap-2 items-center justify-start">
                <Tag className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-xs text-muted-foreground font-medium">Common:</span>
                {commonTags.map(tag => {
                  const isActive = searchTerm.toLowerCase().split(/\s+/).includes(tag.toLowerCase());
                  return (
                    <Badge
                      key={tag}
                      variant={isActive ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary/80 hover:text-primary-foreground transition-colors text-xs"
                      onClick={() => handleCommonTagClick(tag)}
                      title={`Click to ${isActive ? 'remove' : 'add'} "${tag}" tag`}
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-xl font-semibold text-foreground">Loading Cards...</p>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center py-10 bg-destructive/10 p-6 rounded-lg">
            <ServerCrash className="h-12 w-12 text-destructive mb-4" />
            <p className="text-xl font-semibold text-destructive">Error Loading Data</p>
            <p className="text-destructive-foreground">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">Please try refreshing the page or check the console for more details.</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {filteredCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCards.map(card => (
                  <CardItem key={card.id} card={card} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xl font-semibold text-muted-foreground">No cards found matching your search.</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search terms or clicking a common tag.</p>
              </div>
            )}
          </>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} Card Explorer. All rights reserved.</p>
      </footer>
    </div>
  );
}
