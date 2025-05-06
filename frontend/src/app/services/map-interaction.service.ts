import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Restaurant } from '@models/restaurant';

@Injectable({
  providedIn: 'root',
})
export class MapInteractionService {
  // Subject for sending restaurant to zoom to
  private zoomToRestaurantSource = new Subject<Restaurant>();
  zoomToRestaurant$ = this.zoomToRestaurantSource.asObservable();
  get zoomToRestaurant(): Subject<Restaurant> {
    return this.zoomToRestaurantSource;
  }

  // Subject for requesting to open restaurant details from map popup
  private openDetailsSource = new Subject<Restaurant>();
  openDetails$ = this.openDetailsSource.asObservable();
  get openDetails(): Subject<Restaurant> {
    return this.openDetailsSource;
  }
}
