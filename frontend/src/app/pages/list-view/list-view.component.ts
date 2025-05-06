import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { Restaurant } from '@models/restaurant';
import { RestaurantService } from '@services/restaurant.service';
import { MapInteractionService } from '@services/map-interaction.service';
import { Subscription } from 'rxjs';

import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '@components/details/details.component';
import { RestaurantCardComponent } from '@components/restaurant-card/restaurant-card.component';

@Component({
  selector: 'app-list-view',
  imports: [NgFor, MatCardModule, MatDividerModule, RestaurantCardComponent],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css',
})
export class ListViewComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);

  restaurants: Restaurant[] = [];
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
      data: { restaurant },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit(): void {
    this.restaurants = this.restaurantService.getRestaurants();
    this.restaurantSub = this.restaurantService
      .getRestaurantsUpdateListener()
      .subscribe((restaurants: Restaurant[]) => {
        this.restaurants = restaurants;
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
}

export class DialogData {}
