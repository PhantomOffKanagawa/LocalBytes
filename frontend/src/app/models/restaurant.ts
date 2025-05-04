export interface Restaurant {
  id: number;
  title: string;
  description: string;
  rating: number;
  comments: string[];
  geometry: {
    coordinates: [number, number];
  };
}
