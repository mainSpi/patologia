import { verifyAuth, getAllCardsForAdmin } from './actions';
import AdminLoginClient from './AdminLoginClient';
import AdminDashboardClient from './AdminDashboardClient';
import { ServerCrash } from 'lucide-react';

export const metadata = {
  title: 'Admin - Card Explorer',
};

// Ensure this page is dynamically rendered so cookies are checked on each request.
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAuthenticated = await verifyAuth();

  if (!isAuthenticated) {
    return <AdminLoginClient />;
  }

  let cards = [];
  let errorLoadingCards = null;
  try {
    cards = await getAllCardsForAdmin();
  } catch (error) {
    console.error("Error fetching cards for admin dashboard:", error);
    errorLoadingCards = "Failed to load card data. Please try again later.";
  }

  if (errorLoadingCards) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center min-h-[calc(100vh-var(--header-height,10rem))]">
        <ServerCrash className="h-12 w-12 text-destructive mb-4" />
        <p className="text-xl font-semibold text-destructive">Error Loading Card Data</p>
        <p className="text-muted-foreground">{errorLoadingCards}</p>
      </div>
    );
  }
  
  return <AdminDashboardClient initialCards={cards} />;
}
