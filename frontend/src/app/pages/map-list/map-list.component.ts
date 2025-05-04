import { Component } from '@angular/core';
import { MapViewComponent } from '@components/map/map.component';
import { ListViewComponent } from '@pages/list-view/list-view.component';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-map-list',
  imports: [MapViewComponent, ListViewComponent, MatCard],
  templateUrl: './map-list.component.html',
  styleUrl: './map-list.component.css',
})
export class MapListComponent {}
