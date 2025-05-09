import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environment/environment';
import { Restaurant } from '@models/restaurant';
import { RestaurantService } from '@services/restaurant.service';

interface RatingResponse {
  rating: number;
  place_id: string;
  uuid: string;
  error?: string;
  average_rating?: number;
  total_ratings?: number;
}

@Component({
  selector: 'app-star',
  imports: [NgFor, NgIf],
  templateUrl: './star.component.html',
  styleUrl: './star.component.css',
})
export class StarComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private restaurantService: RestaurantService,
    private HttpClient: HttpClient
  ) {}
  @Input() restaurant: Restaurant | undefined = undefined;

  elementID: string | undefined = undefined;
  fixedRating: number | undefined = undefined;
  rated: number | undefined = undefined;
  ratings: number = 0;

  stars = [1, 2, 3, 4, 5];
  rating = 0;
  hovered = 0;

  ngOnInit() {
    this.elementID = this.restaurant?.place_id;
    this.rated = this.restaurant?.user_rating;
    this.fixedRating = this.restaurant?.rating;
    this.ratings = this.restaurant?.ratings ?? 0;

    if (this.fixedRating) {
      this.rating = Math.floor(this.fixedRating * 2) / 2;
    }
  }

  onHover(star: number) {
    this.hovered = star;
  }
  floored(rating: number) {
    return Math.floor(rating);
  }

  onMouseMove(event: MouseEvent, i: number) {
    const target = event.target as HTMLElement;
    const { left, width } = target.getBoundingClientRect();
    const x = event.clientX - left;
    this.hovered = x < width / 2 ? i + 0.5 : i + 1;
  }

  getStarValue(event: MouseEvent, i: number): number {
    const target = event.target as HTMLElement;
    const { left, width } = target.getBoundingClientRect();
    const x = event.clientX - left;
    return x < width / 2 ? i + 0.5 : i + 1;
  }

  rate(star: number) {
    this.rated = star;
    console.log(`Rated ${star} stars for elementId: ${this.elementID}`);
    const token = this.authService.getToken();
    if (this.elementID && token) {
      this.HttpClient.put<RatingResponse>(
        `${environment.apiUrl}/ratings`,
        {
          rating: this.rated,
          place_id: this.elementID,
          token: token,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      ).subscribe({
        next: res => {
          console.log('Rating submitted successfully');
          this.rating = res['average_rating'] ?? this.rating;
          this.ratings = res['total_ratings'] ?? this.ratings;
          this.rated = res['rating'] ?? this.rated;

          const newRestaurant: Restaurant = {
            ...this.restaurant!,
            user_rating: this.rated,
            rating: this.rating ?? this.restaurant!.rating,
            ratings: this.ratings,
          };

          this.restaurantService.updateRestaurant(newRestaurant);
        },
        error: err => console.error('Error submitting rating', err),
      });
    }
  }
}
