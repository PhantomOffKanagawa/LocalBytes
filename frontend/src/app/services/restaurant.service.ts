import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from '@models/restaurant';
import { Subject } from 'rxjs';
import { environment } from '@environment/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private restaurants: Restaurant[] = [];
  private restaurantsUpdated = new Subject<Restaurant[]>();
  private apiUrl = `${environment.apiUrl}/restaurants`;
  lat: number = 38.951561;
  lng: number = -92.328636;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getRestaurants(): Restaurant[] {
    // Since Restaurants are not dynamically updated, we can use sessionStorage to cache them
    // This will prevent unnecessary API calls and improve performance
    // Check if restaurants are stored in sessionStorage
    // const storedRestaurants = sessionStorage.getItem('restaurants');
    // if (storedRestaurants) {
    //   console.log('Using cached restaurants from sessionStorage');
    //   this.restaurants = JSON.parse(storedRestaurants);
    //   return this.restaurants;
    // }

    console.log('Fetching restaurants from API...');
    const token = this.authService.getToken();
    let headers;
    console.log('Token:', token);
    if (token != null) {
      headers = {
        Authorization: `Bearer ${token}`,
      };
    } else {
      headers = {};
    }

    console.log('Headers:', headers);

    // Fetch restaurants from the API and convert them to the Restaurant model
    this.http
      .get<Restaurant[]>(this.apiUrl, {
        headers: headers,
      })
      .subscribe({
        next: data => {
          this.restaurants = data.map(this.restaurantAdapter);
          this.restaurantsUpdated.next([...this.restaurants]);
          // Store restaurants in sessionStorage
          sessionStorage.setItem(
            'restaurants',
            JSON.stringify(this.restaurants)
          );

          console.log('Restaurants fetched:', this.restaurants);
        },
        error: error => {
          console.error('Error fetching restaurants:', error);
        },
      });

    // Return the restaurants array (may be empty at this point)
    return this.restaurants;
  }

  updateRestaurant(restaurant: Restaurant): void {
    // Find the index of the restaurant to update
    const index = this.restaurants.findIndex(r => r.id === restaurant.id);
    if (index !== -1) {
      // Update the restaurant in the array
      this.restaurants[index] = restaurant;
      // Notify subscribers about the update
      this.restaurantsUpdated.next([...this.restaurants]);
      // Update the restaurant in sessionStorage
      // sessionStorage.setItem('restaurants', JSON.stringify(this.restaurants));
    } else {
      console.error('Restaurant not found for update:', restaurant);
    }
  }

  // For rapid development, use an adapter to convert the API response to the Restaurant model
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restaurantAdapter(data: any): Restaurant {
    return {
      id: data._id,
      place_id: data.place_id,
      title: data.name,
      description: data.address,
      rating: data.rating,
      user_rating: data.user_rating,
      ratings: data.user_ratings_total,
      comments: [],
      icon_url: data.icon,
      image_url: data.local_image_url
        ? `${environment.apiUrl}/${data.local_image_url}`
        : undefined,
      geometry: {
        coordinates: [data.location.lng, data.location.lat],
      },
      address: data.address,
      price_level: data.price_level,
      user_ratings_total: data.user_ratings_total,
      google_maps_url: data.google_maps_url,
    };
  }

  getRestaurantsUpdateListener() {
    return this.restaurantsUpdated.asObservable();
  }
}
