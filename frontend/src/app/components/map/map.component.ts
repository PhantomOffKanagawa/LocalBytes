import { environment } from '@environment/environment';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Restaurant } from '@models/restaurant';
import { RestaurantService } from '@services/restaurant.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapViewComponent implements OnInit {
  // Map Properties
  map: mapboxgl.Map | undefined;
  style = environment.mapStyle;
  accessToken = environment.mapBoxApiKey;
  lat: number = 38.951561;
  lng: number = -92.328636;

  // Marker Properties
  restaurants: Restaurant[] = [];
  private restaurantSub: Subscription = new Subscription();

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: this.accessToken,
      container: 'map',
      style: this.style, // Using a lighter base style
      zoom: 14,
      center: [this.lng, this.lat],
    });

    this.map.on('load', () => {
      this.restaurants = this.restaurantService.getRestaurants();
      this.restaurantSub = this.restaurantService
        .getRestaurantsUpdateListener()
        .subscribe((restaurants: Restaurant[]) => {
          this.restaurants = restaurants;
        });

      this.addMarkers();
    });
  }

  addMarkers(): void {
    this.restaurants.forEach(restaurant => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(https://placecats.com/g/50/50/)';
      el.style.width = '50px';
      el.style.height = '50px';

      const lng = restaurant.geometry.coordinates[0];
      const lat = restaurant.geometry.coordinates[1];

      if (isNaN(lng) || isNaN(lat)) {
        console.error('Invalid coordinates for restaurant:', restaurant.title);
        return;
      }

      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${restaurant.title}</h3><p>${restaurant.description}</p><p>Rating: ${restaurant.rating}</p>`
          )
        )
        .addTo(this.map!);
    });
  }
}
