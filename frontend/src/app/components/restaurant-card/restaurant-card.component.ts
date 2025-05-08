import { Component, Input } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Restaurant } from '@models/restaurant';
import { MapInteractionService } from '@services/map-interaction.service';
import { StarComponent } from '@components/star/star.component';
@Component({
  selector: 'app-restaurant-card',
  imports: [
    NgIf,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    StarComponent
  ],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css',
})
export class RestaurantCardComponent {
  // Input property to receive restaurant data
  @Input()
  restaurant: Restaurant = {} as Restaurant;

  constructor(private mapInteractionService: MapInteractionService) {}

  // Method to trigger opening the details dialog
  openDialog(): void {
    if (this.restaurant) {
      this.mapInteractionService.openDetails.next(this.restaurant);
    }
  }

  // Method to trigger zooming to restaurant location on map
  zoomToRestaurant(): void {
    if (this.restaurant) {
      this.mapInteractionService.zoomToRestaurant.next(this.restaurant);
    }
  }
}
