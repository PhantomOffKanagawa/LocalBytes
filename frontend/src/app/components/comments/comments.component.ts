import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '@models/comment';
import { CommentsService } from '@services/comments.service';
import { NgForm, NgModel, FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-comments',
  imports: [NgIf, NgFor, CommonModule, FormsModule, MatIcon],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  @Input() restaurantId!: string;

  comments: Comment[] = []; // Array to hold comments
  newCommentBody: string = ''; // New comment body
  editingComment: Comment | null = null;
  editedBody: string = '';

  constructor(private commentService: CommentsService) {}

  ngOnInit(): void {
    this.commentService.comments$.subscribe((comments) => {
      this.comments = comments.reverse(); // Reverse the order of comments to show the latest first
    })
    this.commentService.getCommentsByPlaceId(this.restaurantId);
  }

  addComment(): void {
    if (!this.newCommentBody.trim()) {
      console.error('Invalid comment or restaurant ID');
      return; // Don't add empty comments
    }

    // Call the service to create a new comment
    // and update the restaurant's comments array
    this.commentService.createComment(this.newCommentBody, this.restaurantId).subscribe({
      next: (comment) => {
        // Add comment to start of the restaurant's comments array
        // and by default make the creator the owner of the comment
        this.comments.unshift({...comment, owner: true});
        this.newCommentBody = ''; // Clear the input field
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      }
    });
  }

  startEdit(comment: Comment): void {
    this.editingComment = comment;
    this.editedBody = comment.body;
  }

  cancelEdit(): void {
    this.editingComment = null;
    this.editedBody = '';
  }

  saveEditedComment(comment_id: string, form: NgForm): void {
    if(form.invalid) return;

    this.commentService.updateComment(comment_id, this.editedBody).subscribe({
      next: (updatedComment) => {
        const index = this.comments.findIndex(c => c._id === comment_id)
        if(index !== -1) {
          this.comments[index].body = this.editedBody;
        }
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Failed to update comment:', err);
      }
    })
  }

  confirmDelete(commentId: string): void {
    const confirmed = confirm("Are you sure you want to delete this comment?");
    if(!confirmed) return;

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(
          c => c._id !== commentId
        )
      },
      error: (err) => console.error("Failed to delete comment:", err)
    })
  }
}
