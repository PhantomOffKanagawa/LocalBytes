import { Comment } from './comment';

export interface Restaurant {
  id: number;
  place_id: string;
  title: string;
  description: string;
  rating: number;
  user_rating?: number;
  ratings?: number;
  comments: Comment[];
  icon_url?: string;
  image_url?: string;
  geometry: {
    coordinates: [number, number];
  };
}
