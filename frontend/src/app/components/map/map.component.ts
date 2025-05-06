import { environment } from '@environment/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Restaurant } from '@models/restaurant';
import { RestaurantService } from '@services/restaurant.service';
import { MapInteractionService } from '@services/map-interaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapViewComponent implements OnInit, OnDestroy {
  // Map Properties
  map: mapboxgl.Map | undefined;
  style = environment.mapStyle;
  accessToken = environment.mapBoxApiKey;
  lat: number = 38.951561;
  lng: number = -92.328636;

  // Marker Properties
  restaurants: Restaurant[] = [];
  markers: { [id: number]: mapboxgl.Marker } = {};
  private restaurantSub: Subscription = new Subscription();
  private zoomSub: Subscription = new Subscription();

  constructor(
    private restaurantService: RestaurantService,
    private mapInteractionService: MapInteractionService
  ) {}

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
          // Clear old markers before adding new ones
          this.clearMarkers();
          this.addMarkers();
        });

      this.addMarkers();
    });

    // Subscribe to zoom requests
    this.zoomSub = this.mapInteractionService.zoomToRestaurant$.subscribe(
      (restaurant: Restaurant) => {
        this.zoomToRestaurant(restaurant);
      }
    );
  }

  // When map is destroyed, unsubscribe from all subscriptions
  ngOnDestroy(): void {
    this.restaurantSub.unsubscribe();
    this.zoomSub.unsubscribe();
  }

  // Clear all markers from the map
  clearMarkers(): void {
    // Clear values to avoid potential orphaned references
    Object.values(this.markers).forEach(marker => marker.remove());
    // Clear the actual markers object
    this.markers = {};
  }

  addMarkers(): void {
    if (!this.map) return;

    this.restaurants.forEach(restaurant => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(${restaurant.icon_url})`;
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.backgroundSize = 'cover';

      const lng = restaurant.geometry.coordinates[0];
      const lat = restaurant.geometry.coordinates[1];

      if (isNaN(lng) || isNaN(lat)) {
        console.error('Invalid coordinates for restaurant:', restaurant.title);
        return;
      }

      // Create popup HTML with a button
      // Sytling doesn't apply from the CSS file so we need to add it here
      const popupStyles = `
        <style>
          .popup-content {
        padding: 5px;
          }
          
          .popup-content h3 {
        margin-top: 0;
        font-weight: bold;
        color: #222;
        margin-bottom: 8px;
          }
          
          .popup-content p {
        margin-bottom: 8px;
          }
          
          .details-btn {
        background-color: #333;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 14px;
        margin-top: 5px;
        transition: background-color 0.3s;
          }
          
          .details-btn:hover {
        background-color: #555;
          }
        </style>
      `;

      // The html is after compilation so we can't use components
      const popupHtml = `
        ${popupStyles}
        <div class="popup-content">
          <h3>${restaurant.title}</h3>
          <p>${restaurant.description}</p>
          <p>Rating: ${restaurant.rating.toPrecision(2)}</p>
          <button class="details-btn" data-restaurant-id="${restaurant.id}">
        View Details
          </button>
        </div>
      `;

      // Create popup with offset
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml);

      // Hacky solution to add event listener to the button inside the popup
      // Add event listener to popup after it's been added to the DOM
      popup.on('open', () => {
        // On open of the popup, we need to add the event listener to the button
        // This calls the mapInteractionService to open the details dialog
        const button = document.querySelector(
          `.details-btn[data-restaurant-id="${restaurant.id}"]`
        );
        if (button) {
          // Remove existing event listeners to prevent multiple calls
          button.removeEventListener('click', (button as any).clickListener);

          // Define the event listener
          (button as any).clickListener = () => {
            this.mapInteractionService.openDetails.next(restaurant);
          };

          // Add the event listener
          button.addEventListener('click', (button as any).clickListener);
        }
      });

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map!);

      // Store marker reference for later use
      this.markers[restaurant.id] = marker;
    });
  }

  zoomToRestaurant(restaurant: Restaurant): void {
    if (!this.map) return;

    // Get the restaurant coordinates
    const lng = restaurant.geometry.coordinates[0];
    const lat = restaurant.geometry.coordinates[1];

    // Validate coordinates
    if (isNaN(lng) || isNaN(lat)) {
      console.error('Invalid coordinates for restaurant:', restaurant.title);
      return;
    }

    // Fly to the restaurant location
    this.map.flyTo({
      center: [lng, lat],
      zoom: 16,
      essential: true,
      duration: 1000,
    });

    // Open the popup for this restaurant
    const marker = this.markers[restaurant.id];
    if (marker) {
      marker.togglePopup();
    }
  }
}
