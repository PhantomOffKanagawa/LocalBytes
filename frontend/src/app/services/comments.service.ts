import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Comment } from '@models/comment';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService{
  private apiUrl = `${environment.apiUrl}/comments`;

  // Add a BehaviorSubject to hold the comments
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  // Method to create a new comment
  // Takes the comment body and place ID as parameters
  // Gets user token from the AuthenticationService
  createComment(body: string, place_id: string): Observable<Comment> {
    const token = this.authService.getToken();
    return this.http.post<Comment>(`${this.apiUrl}/`, { body, place_id, token: token });
  }

  // Method to fetch comments by place ID
  getCommentsByPlaceId(placeId: string): void {
    // Uses token as authorization header for the request
    // This returns owner property as well
    const token = this.authService.getToken();
    this.http.get<Comment[]>(`${this.apiUrl}/place/${placeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .subscribe({
      next: (comments) => {
        this.commentsSubject.next(comments);
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
      }
    });
  }

  updateComment(comment_id: string, newBody: string): Observable<Comment> {
    const token = this.authService.getToken();
      return this.http.put<Comment>(`${this.apiUrl}/${comment_id}`, {
       newBody,
       token,
    })
  }

  deleteComment(commentId: string): Observable<void> {
    const token = this.authService.getToken();
    return this.http.request<void>('delete', `${this.apiUrl}/${commentId}`, {
      body: { token },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(() => {
        const current = this.commentsSubject.value;
        const updated = current.filter(c => c._id !== commentId);
        this.commentsSubject.next(updated);
      })
    );
  }  
}
