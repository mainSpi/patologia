
'use client';

import { useFormState } from 'react-dom';
import type { CardData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Tag as TagIcon, X } from 'lucide-react';
import type { CardFormState } from './actions';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface CardFormProps {
  card?: CardData | null;
  action: (prevState: CardFormState, formData: FormData) => Promise<CardFormState>;
  submitButtonText: string;
  allCommonTags?: string[];
}

const initialState: CardFormState = {
  message: '',
  errors: {},
  success: false,
};

export default function CardForm({ card, action, submitButtonText, allCommonTags = [] }: CardFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const [activeFormTags, setActiveFormTags] = useState<string[]>(card?.tags || []);
  const [newTagInputValue, setNewTagInputValue] = useState('');
  const [hiddenTagsValue, setHiddenTagsValue] = useState<string>((card?.tags || []).join(','));

  useEffect(() => {
    if (card?.tags) {
      setActiveFormTags(card.tags);
      setHiddenTagsValue(card.tags.join(','));
    } else {
      // Reset for create form if card is null/undefined or has no tags
      setActiveFormTags([]);
      setHiddenTagsValue('');
    }
  }, [card?.id]); // Depend on card.id to re-initialize when the card prop changes (e.g. opening edit dialog for different cards)


  useEffect(() => {
    setHiddenTagsValue(activeFormTags.join(','));
  }, [activeFormTags]);

  const handleAddTagFromInput = () => {
    const newTag = newTagInputValue.trim().toLowerCase();
    if (newTag && !activeFormTags.includes(newTag)) {
      setActiveFormTags(prevTags => [...prevTags, newTag]);
    }
    setNewTagInputValue('');
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTagFromInput();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setActiveFormTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  const handleCommonTagClick = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (!activeFormTags.includes(lowerTag)) {
      setActiveFormTags(prevTags => [...prevTags, lowerTag]);
    }
  };


  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {/* Success message handled by toast in AdminDashboardClient now */}


      <input type="hidden" name="tags" value={hiddenTagsValue} />

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={card?.title}
          required
          className="mt-1"
          aria-describedby="title-error"
        />
        {state.errors?.title && <p id="title-error" className="text-sm text-destructive mt-1">{state.errors.title.join(', ')}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={card?.description}
          required
          rows={3}
          className="mt-1"
          aria-describedby="description-error"
        />
        {state.errors?.description && <p id="description-error" className="text-sm text-destructive mt-1">{state.errors.description.join(', ')}</p>}
      </div>

      <div>
        <Label htmlFor="tag-input">Tags</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="tag-input"
            type="text"
            value={newTagInputValue}
            onChange={(e) => setNewTagInputValue(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Type a tag and press Enter"
            className="flex-grow"
          />
          <Button type="button" variant="outline" onClick={handleAddTagFromInput}>Add Tag</Button>
        </div>
        {activeFormTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {activeFormTags.map(tag => (
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
        {state.errors?.tags && <p className="text-sm text-destructive mt-1">{state.errors.tags.join(', ')}</p>}

        {allCommonTags.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border">
            <div className="flex flex-wrap gap-2 items-center">
              <TagIcon className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground font-medium">Commonly used:</span>
              {allCommonTags.filter(ct => !activeFormTags.includes(ct.toLowerCase())).slice(0,10).map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary/80 text-xs font-normal"
                  onClick={() => handleCommonTagClick(tag)}
                  title={`Add tag "${tag}"`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL / Path</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="text"
          defaultValue={card?.imageUrl}
          required
          className="mt-1"
          placeholder="e.g., /laminas/my-slide.jpg or https://example.com/image.png"
          aria-describedby="imageUrl-error"
        />
        {state.errors?.imageUrl && <p id="imageUrl-error" className="text-sm text-destructive mt-1">{state.errors.imageUrl.join(', ')}</p>}
      </div>

      <div>
        <Label htmlFor="svsUrl">SVS URL / Path (Tile Source)</Label>
        <Input
          id="svsUrl"
          name="svsUrl"
          type="text"
          defaultValue={card?.svsUrl}
          required
          className="mt-1"
          placeholder="e.g., /laminas/my-slide.dzi or /laminas/my-large-image.jpg"
          aria-describedby="svsUrl-error"
        />
        {state.errors?.svsUrl && <p id="svsUrl-error" className="text-sm text-destructive mt-1">{state.errors.svsUrl.join(', ')}</p>}
      </div>

      <Button type="submit">{submitButtonText}</Button>
    </form>
  );
}

