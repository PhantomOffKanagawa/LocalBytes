import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from '@models/restaurant';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private restaurants: Restaurant[] = [];
  private restaurantsUpdated = new Subject<Restaurant[]>();
  lat: number = 38.951561;
  lng: number = -92.328636;

  constructor(private http: HttpClient) {
    for (let i = 0; i < 10; i++) {
      // Generate random coordinates around the initial location
      const coordinates: [number, number] = [
        this.lng + Math.random() * 0.1 - 0.05,
        this.lat + Math.random() * 0.1 - 0.05,
      ];
      const rest: Restaurant = {
        id: i,
        title: `This is test ${i + 1}`,
        description: `This is test ${i + 1}`,
        rating: 5.0,
        comments: [`This is test ${i + 1}`],
        geometry: {
          coordinates: coordinates,
        },
      };
      this.restaurants.push(rest);
    }
  }

  getRestaurants(): Restaurant[] {
    return this.restaurants;
  }

  getRestaurantsUpdateListener() {
    return this.restaurantsUpdated.asObservable();
  }
}
