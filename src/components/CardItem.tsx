
import type { CardData } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface CardItemProps {
  card: CardData;
}

export default function CardItem({ card }: CardItemProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <Link href={`/view/${card.id}`} className="block group flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={card.imageUrl}
              alt={card.title}
              fill
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors truncate" title={card.title}>
            {card.title}
          </CardTitle>
          <CardDescription className="text-sm line-clamp-3 mb-2 h-[3.75rem]" title={card.description}>
            {card.description}
          </CardDescription>
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {card.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
              {card.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">+{card.tags.length - 3}</Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t mt-auto">
          <div
            className="w-full text-sm inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
          >
            <Eye className="mr-2 h-4 w-4" /> View Details
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
