import { Component, OnInit } from '@angular/core';
import { Restaurant } from '@models/restaurant';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RestaurantService } from '@services/restaurant.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [NgFor, MatCardModule],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css',
})
export class ListViewComponent implements OnInit {
  // Restaurant Properties
  restaurants: Restaurant[] = [];
  private restaurantSub: Subscription = new Subscription();
  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurants = this.restaurantService.getRestaurants();
    this.restaurantSub = this.restaurantService
      .getRestaurantsUpdateListener()
      .subscribe((restaurants: Restaurant[]) => {
        this.restaurants = restaurants;
      });
  }
}
