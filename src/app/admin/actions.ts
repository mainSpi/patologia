'use server';

import fs from 'fs/promises';
import path from 'path';
import { cookies, type ReadonlyRequestCookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { CardData } from '@/types';
import { ADMIN_PASSWORD, ADMIN_AUTH_COOKIE_NAME } from '@/lib/constants';
import { z } from 'zod';

const cardSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  tags: z.string().transform(tags => tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)),
  imageUrl: z.string().min(1, "Image URL/Path is required"), // No longer z.string().url()
  svsUrl: z.string().min(1, "SVS URL/Path is required"), // No longer z.string().url()
});

export type CardFormState = {
  message: string;
  errors?: Partial<Record<keyof z.infer<typeof cardSchema>, string[]>>;
  success: boolean;
  newCardData?: CardData; // To help update client state after creation
};

const CARDS_DIR = path.join(process.cwd(), 'public/data/cards');

function generateCardId(title: string): string {
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  // Using a shorter timestamp and a random element to reduce length and ensure uniqueness
  const timestamp = Date.now().toString(36).slice(-4);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  let baseSlug = `${slug.substring(0, 30)}-${timestamp}${randomSuffix}`;
  if (baseSlug.startsWith('-')) {
    baseSlug = `card-${timestamp}${randomSuffix}`;
  }
  return baseSlug.substring(0, 50); // Max length for ID
}

export async function loginAction(password: string): Promise<{ success: boolean; message: string }> {
  if (password === ADMIN_PASSWORD) {
    cookies().set(ADMIN_AUTH_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return { success: true, message: 'Login successful.' };
  }
  return { success: false, message: 'Invalid password.' };
}

export async function logoutAction(): Promise<void> {
  cookies().delete(ADMIN_AUTH_COOKIE_NAME);
  revalidatePath('/admin');
}

// Updated verifyAuth to accept cookieStore
export async function verifyAuth(cookieStore: ReadonlyRequestCookies): Promise<boolean> {
  const authToken = cookieStore.get(ADMIN_AUTH_COOKIE_NAME);
  return authToken?.value === 'true';
}

export async function createCardAction(prevState: CardFormState, formData: FormData): Promise<CardFormState> {
  const cookieStore = cookies();
  if (!(await verifyAuth(cookieStore))) {
    return { success: false, message: "Unauthorized", errors: {} };
  }

  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = cardSchema.safeParse(rawFormData);
  
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data.",
    };
  }

  const { title, description, tags, imageUrl, svsUrl } = validatedFields.data;
  const id = generateCardId(title);
  const newCard: CardData = { id, title, description, tags, imageUrl, svsUrl };

  try {
    await fs.mkdir(CARDS_DIR, { recursive: true });
    const filePath = path.join(CARDS_DIR, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(newCard, null, 2));
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, message: `Card "${title}" created successfully.`, newCardData: newCard };
  } catch (error) {
    console.error("Failed to create card:", error);
    return { success: false, message: "Failed to create card. Check server logs.", errors: {} };
  }
}

export async function updateCardAction(cardId: string, prevState: CardFormState, formData: FormData): Promise<CardFormState> {
  const cookieStore = cookies();
  if (!(await verifyAuth(cookieStore))) {
    return { success: false, message: "Unauthorized", errors: {} };
  }

  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = cardSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data.",
    };
  }
  
  const { title, description, tags, imageUrl, svsUrl } = validatedFields.data;
  const updatedCard: CardData = { id: cardId, title, description, tags, imageUrl, svsUrl };
  
  try {
    const filePath = path.join(CARDS_DIR, `${cardId}.json`);
    // Check if file exists before writing
    try {
        await fs.access(filePath);
    } catch (e) {
        return { success: false, message: `Card with ID "${cardId}" not found for update.`, errors: {} };
    }
    await fs.writeFile(filePath, JSON.stringify(updatedCard, null, 2));
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/view/${cardId}`);
    return { success: true, message: `Card "${title}" updated successfully.`, newCardData: updatedCard };
  } catch (error) {
    console.error(`Failed to update card ${cardId}:`, error);
    return { success: false, message: `Failed to update card. Check server logs.`, errors: {} };
  }
}

export async function deleteCardAction(cardId: string): Promise<{ success: boolean; message: string }> {
  const cookieStore = cookies();
  if (!(await verifyAuth(cookieStore))) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const filePath = path.join(CARDS_DIR, `${cardId}.json`);
    await fs.unlink(filePath);
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, message: `Card with ID "${cardId}" deleted successfully.` };
  } catch (error) {
    console.error(`Failed to delete card ${cardId}:`, error);
     if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return { success: false, message: `Card with ID "${cardId}" not found.` };
    }
    return { success: false, message: `Failed to delete card. Check server logs.` };
  }
}

export async function getAllCardsForAdmin(): Promise<CardData[]> {
  const cookieStore = cookies();
  if (!(await verifyAuth(cookieStore))) {
    return []; // Or throw an error
  }
  try {
    await fs.mkdir(CARDS_DIR, { recursive: true }); // Ensure directory exists
    const filenames = await fs.readdir(CARDS_DIR);
    const cardPromises = filenames
      .filter(filename => filename.endsWith('.json'))
      .map(async filename => {
        const filePath = path.join(CARDS_DIR, filename);
        const fileContents = await fs.readFile(filePath, 'utf-8');
        try {
          return JSON.parse(fileContents) as CardData;
        } catch (parseError) {
          console.error(`Error parsing JSON from ${filename}:`, parseError);
          return null;
        }
      });
    const results = await Promise.all(cardPromises);
    return results.filter(card => card !== null).sort((a,b) => a.title.localeCompare(b.title)) as CardData[];
  } catch (error) {
    // If CARDS_DIR doesn't exist, readdir will fail.
    // Check if it's an ENOENT error, which means the directory likely doesn't exist.
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        console.warn("Cards directory not found. This is normal if no cards have been created yet.");
        return []; // Return empty array if directory doesn't exist
    }
    console.error("Failed to load cards data for admin:", error);
    return [];
  }
}