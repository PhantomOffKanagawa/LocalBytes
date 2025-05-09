import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Restaurant } from '@models/restaurant';
import { RestaurantService } from '@services/restaurant.service';
import { MapInteractionService } from '@services/map-interaction.service';
import { Subscription } from 'rxjs';

import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '@components/details/details.component';
import { RestaurantCardComponent } from '@components/restaurant-card/restaurant-card.component';
import { Input } from '@angular/core';
import Fuse from 'fuse.js';

@Component({
  selector: 'app-list-view',
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatDividerModule,
    RestaurantCardComponent,
    FormsModule,
  ],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css',
})
export class ListViewComponent implements OnInit, OnDestroy {
  @Input() standalone: boolean = true;
  readonly dialog = inject(MatDialog);

  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  searchQuery: string = '';
  selectedPriceLevel: number | '' = '';
  minRating: number | null = null;

  private restaurantSub: Subscription = new Subscription();
  private detailsRequestSub: Subscription = new Subscription();

  constructor(
    private restaurantService: RestaurantService,
    private mapInteractionService: MapInteractionService
  ) {}

  openDialog(restaurant: Restaurant): void {
    console.log('openDialog', restaurant);
    const dialogRef = this.dialog.open(DetailsComponent, {
      width: '1000px',
      panelClass: 'bg-gray-100',
      data: { restaurant },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit(): void {
    this.restaurants = this.restaurantService.getRestaurants();
    this.filteredRestaurants = [...this.restaurants];

    this.restaurantSub = this.restaurantService
      .getRestaurantsUpdateListener()
      .subscribe((restaurants: Restaurant[]) => {
        this.restaurants = restaurants;
        this.applyFilters();
      });

    // Listen for requests to open details from map popups
    this.detailsRequestSub = this.mapInteractionService.openDetails$.subscribe(
      (restaurant: Restaurant) => {
        this.openDialog(restaurant);
      }
    );
  }

  ngOnDestroy(): void {
    this.restaurantSub.unsubscribe();
    this.detailsRequestSub.unsubscribe();
  }

  applyFilters(): void {
    let filtered = [...this.restaurants];

    // Apply price level and rating filters first
    filtered = filtered.filter(restaurant => {
      const matchesPriceLevel =
        this.selectedPriceLevel === '' ||
        restaurant.price_level == this.selectedPriceLevel;
      const matchesRating =
        this.minRating === null || restaurant.rating >= this.minRating;

      return matchesPriceLevel && matchesRating;
    });

    // Apply fuzzy search if there's a search query
    if (this.searchQuery) {
      const fuse = new Fuse(filtered, {
        keys: ['title', 'description', 'address'],
        threshold: 0.5,
        distance: 100,
      });

      const searchResults = fuse.search(this.searchQuery);
      this.filteredRestaurants = searchResults.map(result => result.item);
    } else {
      this.filteredRestaurants = filtered;
    }
  }
}

export class DialogData {}
