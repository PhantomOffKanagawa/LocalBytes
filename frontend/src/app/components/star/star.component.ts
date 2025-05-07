import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { AuthenticationService } from '@services/authentication.service';
import { environment } from '@environment/environment';
@Component({
  selector: 'app-star',
  imports: [NgFor],
  templateUrl: './star.component.html',
  styleUrl: './star.component.css'
})
export class StarComponent {
  constructor(private authService: AuthenticationService, private HttpClient: HttpClient) {}
  @Input() elementID: number | undefined = undefined;

  stars = [1, 2, 3, 4, 5];
  rating = 0;
  hovered = 0;

  onHover(star: number) {
    this.hovered = star;
  }
  floored(){
    return Math.floor(this.hovered || this.rating)
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
    this.rating = star;
    console.log(`Rated ${star} stars for elementId: ${this.elementID}`);
    const token = this.authService.getToken();
    if(this.elementID && token){
      this.HttpClient.put(`${environment.apiUrl}/ratings`, {
        rating: this.rating,
        place_id: this.elementID,
        token: token
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe({
        next: (res) => console.log('Rating submitted', res),
        error: (err) => console.error('Error submitti ng rating', err)
      });
    }
  }
}
