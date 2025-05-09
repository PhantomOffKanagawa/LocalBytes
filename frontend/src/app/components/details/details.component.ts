import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Restaurant } from '@models/restaurant';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommentsService } from '@services/comments.service';
import { StarComponent } from '@components/star/star.component';
import { FormsModule } from '@angular/forms';
import { CommentsComponent } from '@components/comments/comments.component';

@Component({
  selector: 'app-details',
  imports: [
    NgIf,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatListModule,
    CommentsComponent,
    StarComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  readonly dialogRef = inject(MatDialogRef<DetailsComponent>);
  onNoClick(): void {
    this.dialogRef.close();
  }
  restaurant: Restaurant;

  // Injecting the CommentsService to manage comments
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { restaurant: Restaurant },
    private commentsService: CommentsService
  ) {
    this.restaurant = data.restaurant;

    // // Subscribe to the comments observable to get the latest comments
    // this.commentsService.comments$.subscribe((comments) => {
    //   this.restaurant.comments = comments;
    //   console.log('Comments updated:', this.restaurant.comments); // Log the updated comments
    // });

    // // Fetch comments for the restaurant when the component is initialized
    // this.commentsService.getCommentsByPlaceId(this.restaurant.id.toString());
  }
}
