import { Routes } from '@angular/router';
import { HomepageComponent } from '@pages/homepage/homepage.component';
import { ListViewComponent } from '@pages/list-view/list-view.component';
import { MapViewComponent } from './components/map/map.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    title: 'This is a homepage',
  },
  {
    path: 'map',
    component: MapViewComponent,
    title: 'This is a map view',
  },
  {
    path: 'list',
    component: ListViewComponent,
    title: 'Restaurant List',
  },
];
