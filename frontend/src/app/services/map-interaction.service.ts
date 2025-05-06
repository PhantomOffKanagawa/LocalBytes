import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Restaurant } from '@models/restaurant';

@Injectable({
  providedIn: 'root',
})
export class MapInteractionService {
  // Subject for sending restaurant to zoom to
  zoomToRestaurantSource = new Subject<Restaurant>();
  zoomToRestaurant$ = this.zoomToRestaurantSource.asObservable();

  // Subject for requesting to open restaurant details from map popup
  openDetailsSource = new Subject<Restaurant>();
  openDetails$ = this.openDetailsSource.asObservable();
}
