
'use client';

import type { CardData } from '@/types';
import { useState, useMemo, useCallback } from 'react';
import CardItem from '@/components/CardItem';
import { Input } from '@/components/ui/input';
import { Search, Loader2, ServerCrash, Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HomePageClientProps {
  initialCards: CardData[];
}

export default function HomePageClient({ initialCards }: HomePageClientProps) {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  
  // isLoading and error states are simplified as initial data is provided by props.
  // These could be used for future client-side async operations if any.
  const [isLoading, setIsLoading] = useState(false); // Not for initial load, but for potential future use
  const [error, setError] = useState<string | null>(null); // Not for initial load

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      e.preventDefault();
      const newTag = searchTerm.trim().toLowerCase();
      if (newTag && !activeTags.includes(newTag)) {
        setActiveTags(prevTags => [...prevTags, newTag]);
      }
      setSearchTerm('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setActiveTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  const handleCommonTagClick = useCallback((tag: string) => {
    const lowerTag = tag.toLowerCase();
    setActiveTags(prevTags => {
      if (prevTags.includes(lowerTag)) {
        return prevTags.filter(t => t !== lowerTag);
      } else {
        return [...prevTags, lowerTag];
      }
    });
  }, []);

  const filteredCards = useMemo(() => {
    if (activeTags.length === 0) return cards;

    return cards.filter(card => {
      const cardTagsLower = card.tags.map(t => t.toLowerCase());
      return activeTags.every(activeTag =>
        cardTagsLower.some(cardTag => cardTag.includes(activeTag))
      );
    });
  }, [cards, activeTags]);

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
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [cards]);

  // Simplified loading state for the page content itself, not data fetching.
  if (isLoading) { // This might be relevant if client-side ops introduce loading
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-semibold text-foreground">Processing...</p>
      </div>
    );
  }

  // Simplified error state
  if (error) {
     return (
        <div className="flex flex-col items-center justify-center text-center py-10 bg-destructive/10 p-6 rounded-lg">
          <ServerCrash className="h-12 w-12 text-destructive mb-4" />
          <p className="text-xl font-semibold text-destructive">An Error Occurred</p>
          <p className="text-destructive-foreground">{error}</p>
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 sticky top-[calc(3.5rem+1px)] md:top-[calc(3.5rem+1px)] bg-background py-4 z-20 shadow-sm -mx-4 px-4">
        <div className="relative max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={
                activeTags.length === 0 
                  ? "Type a tag and press Enter..." 
                  : "Add another tag..."
              }
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="pl-10 pr-4 py-3 w-full rounded-full text-base border-2 focus:border-primary transition-colors"
              aria-label="Add tag to search"
            />
          </div>

          {activeTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center mt-3 px-1">
              {activeTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="py-1 px-2.5 rounded-md text-sm font-normal flex items-center gap-1.5 shadow-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 p-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {commonTags.length > 0 && (
          <div className="max-w-3xl mx-auto mt-4 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-2 items-center justify-start">
              <Tag className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground font-medium">Common:</span>
              {commonTags.map(tag => {
                const isActive = activeTags.includes(tag.toLowerCase());
                return (
                  <Badge
                    key={tag}
                    variant={isActive ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-primary/80 hover:text-primary-foreground transition-colors text-xs font-normal"
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

      {initialCards.length === 0 && activeTags.length === 0 && ( // Check initialCards for the "no cards available" message
         <div className="text-center py-10">
            <p className="text-xl font-semibold text-muted-foreground">No cards available.</p>
            <p className="text-sm text-muted-foreground">There are currently no cards to display.</p>
          </div>
      )}

      {initialCards.length > 0 && filteredCards.length === 0 && activeTags.length > 0 && (
         <div className="text-center py-10">
            <p className="text-xl font-semibold text-muted-foreground">No cards match your selected tags.</p>
            <p className="text-sm text-muted-foreground">Try removing some tags or broadening your search.</p>
          </div>
      )}
      
      {filteredCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCards.map(card => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
