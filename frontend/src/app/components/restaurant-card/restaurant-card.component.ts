import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '@components/details/details.component';
import { Restaurant } from '@models/restaurant';

@Component({
  selector: 'app-restaurant-card',
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {
  // Input property to receive restaurant data
  @Input()
  restaurant: Restaurant = {} as Restaurant;

  // Variable to handle opening the dialog
  @Output()
  viewDetails = new EventEmitter<void>();
}
