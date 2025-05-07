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
import { CommentsService } from '@services/comments.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatListModule,
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
  comments: Comment[] = []; // Array to hold comments
  newCommentBody: string = ''; // New comment body

  // Injecting the CommentsService to manage comments
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { restaurant: Restaurant },
    private commentsService: CommentsService
  ) {
    this.restaurant = data.restaurant;

    // Subscribe to the comments observable to get the latest comments
    this.commentsService.comments$.subscribe((comments) => {
      this.restaurant.comments = comments;
      console.log('Comments updated:', this.restaurant.comments); // Log the updated comments
    });

    // Fetch comments for the restaurant when the component is initialized
    this.commentsService.getCommentsByPlaceId(this.restaurant.id.toString());
  }

  addComment(): void {
    if (!this.newCommentBody.trim() || this.restaurant.id === undefined) {
      console.error('Invalid comment or restaurant ID');
      return; // Don't add empty comments
    }

    // Call the service to create a new comment
    // and update the restaurant's comments array
    this.commentsService.createComment(this.newCommentBody, this.restaurant.id.toString()).subscribe({
      next: (comment) => {
        // Add comment to start of the restaurant's comments array
        // and by default make the creator the owner of the comment
        this.restaurant.comments = [{...comment, owner: true}, ...this.restaurant.comments];
        this.newCommentBody = ''; // Clear the input field
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      }
    });
  }
}
