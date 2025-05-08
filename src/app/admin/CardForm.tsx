'use client';

import { useFormState } from 'react-dom';
import type { CardData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { CardFormState } from './actions';

interface CardFormProps {
  card?: CardData | null;
  action: (prevState: CardFormState, formData: FormData) => Promise<CardFormState>;
  submitButtonText: string;
}

const initialState: CardFormState = {
  message: '',
  errors: {},
  success: false,
};

export default function CardForm({ card, action, submitButtonText }: CardFormProps) {
  const [state, formAction] = useFormState(action.bind(null, card?.id ?? ''), initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {state.message && state.success && (
         <Alert variant="default" className="bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

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
          rows={4}
          className="mt-1"
          aria-describedby="description-error"
        />
        {state.errors?.description && <p id="description-error" className="text-sm text-destructive mt-1">{state.errors.description.join(', ')}</p>}
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={card?.tags.join(', ')}
          className="mt-1"
          aria-describedby="tags-error"
        />
        {state.errors?.tags && <p id="tags-error" className="text-sm text-destructive mt-1">{state.errors.tags.join(', ')}</p>}
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={card?.imageUrl}
          required
          className="mt-1"
          aria-describedby="imageUrl-error"
        />
        {state.errors?.imageUrl && <p id="imageUrl-error" className="text-sm text-destructive mt-1">{state.errors.imageUrl.join(', ')}</p>}
      </div>

      <div>
        <Label htmlFor="svsUrl">SVS URL (Tile Source URL)</Label>
        <Input
          id="svsUrl"
          name="svsUrl"
          type="url"
          defaultValue={card?.svsUrl}
          required
          className="mt-1"
          aria-describedby="svsUrl-error"
        />
        {state.errors?.svsUrl && <p id="svsUrl-error" className="text-sm text-destructive mt-1">{state.errors.svsUrl.join(', ')}</p>}
      </div>

      <Button type="submit">{submitButtonText}</Button>
    </form>
  );
}
