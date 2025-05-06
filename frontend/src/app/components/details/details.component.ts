import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Restaurant } from '@models/restaurant';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-details',
  imports: [NgFor, NgIf, MatCardModule, MatDividerModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  readonly dialogRef = inject(MatDialogRef<DetailsComponent>);
  onNoClick(): void {
    this.dialogRef.close();
  }
  restaurant: Restaurant;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { restaurant: Restaurant }
  ) {
    this.restaurant = data.restaurant;
  }

  addComment(comment: string) {
    if (comment) {
      this.restaurant.comments.push(comment);
    }
  }
}
