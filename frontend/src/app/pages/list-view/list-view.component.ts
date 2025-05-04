import { Component, OnInit, inject } from '@angular/core';

import { Restaurant } from '@models/restaurant';
import { RestaurantService } from '@services/restaurant.service';
import { Subscription } from 'rxjs';

import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DetailsComponent } from '@components/details/details.component';

@Component({
  selector: 'app-list-view',
  imports: [NgFor, NgIf, MatCardModule, MatDividerModule],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.css',
})
export class ListViewComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  openDialog(restaurant: Restaurant): void {
    const dialogRef = this.dialog.open(DetailsComponent, {
      width: '1000px',
      data: { restaurant },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

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

export class DialogData {}
