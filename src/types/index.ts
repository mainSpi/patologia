export interface CardData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  svsUrl: string; // URL to the SVS/DZI file or a large image for OpenSeadragon
}
