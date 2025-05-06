import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DetailsComponent } from '@components/details/details.component';
import { Restaurant } from '@models/restaurant';
import { MapInteractionService } from '@services/map-interaction.service';

@Component({
  selector: 'app-restaurant-card',
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css',
})
export class RestaurantCardComponent {
  // Input property to receive restaurant data
  @Input()
  restaurant: Restaurant = {} as Restaurant;

  // Variable to handle opening the dialog
  // @Output()
  // viewDetails = new EventEmitter<void>();

  constructor(private mapInteractionService: MapInteractionService) {}

  // Method to trigger opening the details dialog
  openDialog(): void {
    if (this.restaurant) {
      this.mapInteractionService.openDetailsSource.next(this.restaurant);
    }
  }

  // Method to trigger zooming to restaurant location on map
  zoomToRestaurant(): void {
    if (this.restaurant) {
      this.mapInteractionService.zoomToRestaurantSource.next(this.restaurant);
    }
  }
}
