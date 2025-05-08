'use client';

import type { CardData } from '@/types';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CardForm from './CardForm';
import { createCardAction, updateCardAction, deleteCardAction, logoutAction } from './actions';
import { PlusCircle, Edit, Trash2, LogOut, Eye, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import Image from 'next/image';

interface AdminDashboardClientProps {
  initialCards: CardData[];
}

export default function AdminDashboardClient({ initialCards }: AdminDashboardClientProps) {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleLogout = async () => {
    startTransition(async () => {
      await logoutAction();
      // Revalidation in action should trigger page reload or redirect
      // Forcing reload as a fallback
      window.location.reload();
    });
  };

  const handleDelete = async (cardId: string) => {
    startTransition(async () => {
      const result = await deleteCardAction(cardId);
      if (result.success) {
        setCards(prev => prev.filter(card => card.id !== cardId));
        toast({ title: "Success", description: result.message, variant: "default" });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };
  
  const onFormSuccess = (message: string, newCardData?: CardData, updatedCardId?: string) => {
    toast({ title: "Success", description: message, variant: "default" });
    if (newCardData) { // Create
      setCards(prev => [...prev, newCardData]); // This is tricky if ID is server-generated and not returned easily
    } else if (updatedCardId && selectedCard) { // Update
       // To get the full updated card data, we'd ideally refetch or get it from the action
       // For now, optimistic update on client if possible, or just refresh from server.
       // A simpler approach is to trigger a full re-fetch of cards or just update the fields if action provides them.
    }
    // For simplicity, we rely on revalidatePath to refresh data, but for instant UI update:
    // A better way would be for createCardAction/updateCardAction to return the created/updated card data.
    // Then we can update `cards` state precisely.
    // For now, closing dialogs. The list will refresh on next page load or via revalidatePath.
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedCard(null);
     // Force a re-fetch or rely on revalidatePath. For now, this requires a manual refresh or navigation.
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <div className="space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Card
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Card</DialogTitle>
                <DialogDescription>Fill in the details for the new card.</DialogDescription>
              </DialogHeader>
              <CardForm
                action={async (prevState, formData) => {
                  const result = await createCardAction(prevState, formData);
                  if (result.success) onFormSuccess(result.message);
                  return result;
                }}
                submitButtonText="Create Card"
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleLogout} disabled={isPending}>
            <LogOut className="mr-2 h-4 w-4" /> {isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>

      {cards.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">No cards found. Add a new card to get started.</p>
      ) : (
        <div className="space-y-4">
          {cards.map(card => (
            <div key={card.id} className="bg-card p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-grow">
                <div className="relative w-20 h-16 rounded overflow-hidden shrink-0">
                   <Image src={card.imageUrl || `https://picsum.photos/seed/${card.id}/80/64`} alt={card.title} layout="fill" objectFit="cover" data-ai-hint="microscope image" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">{card.title}</h3>
                  <p className="text-xs text-muted-foreground">ID: {card.id}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{card.description}</p>
                </div>
              </div>
              <div className="flex space-x-2 shrink-0 self-end sm:self-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/view/${card.id}`} target="_blank">
                    <Eye className="mr-1 h-3.5 w-3.5" /> View
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
                <Dialog
                  open={isEditDialogOpen && selectedCard?.id === card.id}
                  onOpenChange={(open) => {
                    if (open) {
                      setSelectedCard(card);
                      setIsEditDialogOpen(true);
                    } else {
                      setIsEditDialogOpen(false);
                      setSelectedCard(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Card: {selectedCard?.title}</DialogTitle>
                      <DialogDescription>Update the details for this card.</DialogDescription>
                    </DialogHeader>
                    {selectedCard && (
                      <CardForm
                        card={selectedCard}
                        action={async (prevState, formData) => {
                            const result = await updateCardAction(selectedCard.id, prevState, formData);
                            if (result.success) onFormSuccess(result.message, undefined, selectedCard.id);
                            return result;
                        }}
                        submitButtonText="Update Card"
                      />
                    )}
                  </DialogContent>
                </Dialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the card
                        titled &quot;{card.title}&quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(card.id)}
                        disabled={isPending}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isPending ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
