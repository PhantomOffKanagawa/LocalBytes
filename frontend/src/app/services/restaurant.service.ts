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

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  getRestaurants(): Restaurant[] {
    // Since Restaurants are not dynamically updated, we can use sessionStorage to cache them
    // This will prevent unnecessary API calls and improve performance
    // Check if restaurants are stored in sessionStorage
    const storedRestaurants = sessionStorage.getItem('restaurants');
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

  // For rapid development, use an adapter to convert the API response to the Restaurant model
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restaurantAdapter(data: any): Restaurant {
    return {
      id: data._id,
      title: data.name,
      description: data.address,
      rating: data.rating,
      user_rating: data.user_rating,
      comments: [],
      icon_url: data.icon,
      geometry: {
        coordinates: [data.location.lng, data.location.lat],
      },
    };
  }

  getRestaurantsUpdateListener() {
    return this.restaurantsUpdated.asObservable();
  }
}
