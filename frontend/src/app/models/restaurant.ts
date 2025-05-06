export interface Restaurant {
  id: number;
  title: string;
  description: string;
  rating: number;
  comments: string[];
  icon_url?: string;
  image_url?: string;
  geometry: {
    coordinates: [number, number];
  };
}
