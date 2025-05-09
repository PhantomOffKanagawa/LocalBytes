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
  address?: string;
  price_level?: number;
  user_ratings_total?: number;
  // opening_hours?: {
  //   open_now: boolean;
  // };
  google_maps_url?: string;
}
