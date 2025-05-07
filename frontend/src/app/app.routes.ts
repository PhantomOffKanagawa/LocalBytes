import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { ListViewComponent } from '@pages/list-view/list-view.component';
import { MapListComponent } from '@pages/map-list/map-list.component';
import { StarComponent } from '@components/star/star.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'This is a homepage',
  },
  {
    path: 'map-list',
    component: MapListComponent,
    title: 'Restaurant Map',
  },
  {
    path: 'list',
    component: ListViewComponent,
    title: 'Restaurant List',
  },
];
