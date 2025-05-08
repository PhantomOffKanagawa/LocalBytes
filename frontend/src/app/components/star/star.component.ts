import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environment/environment';
@Component({
  selector: 'app-star',
  imports: [NgFor, NgIf],
  templateUrl: './star.component.html',
  styleUrl: './star.component.css'
})
export class StarComponent {
  constructor(private authService: AuthenticationService, private HttpClient: HttpClient) {}
  @Input() elementID: number | undefined = undefined;
  @Input() fixedRating: number | undefined = undefined;
  @Input() rated: number | undefined = undefined;

  stars = [1, 2, 3, 4, 5];
  rating = 0;
  hovered = 0;

  ngOnInit() {
    if (this.fixedRating) {
      this.rating = Math.floor(this.fixedRating * 2) / 2;
    }
  }

  onHover(star: number) {
    this.hovered = star;
  }
  floored(rating: number) {
    return Math.floor(rating);
  }

  onMouseMove(event: MouseEvent, i: number) {
    const target = event.target as HTMLElement;
    const { left, width } = target.getBoundingClientRect();
    const x = event.clientX - left;
    this.hovered = x < width / 2 ? i + 0.5 : i + 1;
  }

  getStarValue(event: MouseEvent, i: number): number {
    const target = event.target as HTMLElement;
    const { left, width } = target.getBoundingClientRect();
    const x = event.clientX - left;
    return x < width / 2 ? i + 0.5 : i + 1;
  }

  rate(star: number) {
    this.rated = star;
    console.log(`Rated ${star} stars for elementId: ${this.elementID}`);
    const token = this.authService.getToken();
    if(this.elementID && token){
      this.HttpClient.put(`${environment.apiUrl}/ratings`, {
        rating: this.rated,
        place_id: this.elementID,
        token: token
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe({
        next: (res) => console.log('Rating submitted', res),
        error: (err) => console.error('Error submitting rating', err)
      });
    }
  }
}
