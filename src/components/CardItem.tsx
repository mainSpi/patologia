import type { CardData } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Eye } from 'lucide-react';
import { Button } from './ui/button';

interface CardItemProps {
  card: CardData;
}

const CardItem: React.FC<CardItemProps> = ({ card }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={card.imageUrl}
            alt={card.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="microscope slide"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-semibold mb-2 text-primary">{card.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-3">{card.description}</CardDescription>
        <div className="flex flex-wrap gap-2 mt-2 items-center">
          <Tag className="h-4 w-4 text-accent mr-1" />
          {card.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
          {card.tags.length > 3 && <Badge variant="outline" className="text-xs">+{card.tags.length - 3} more</Badge>}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full" size="sm">
          <Link href={`/view/${card.id}`}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardItem;
