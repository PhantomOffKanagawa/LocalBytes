import { Routes } from "@angular/router";
import { HomeComponent } from "./Homepage/homepage/home/home.component";
import { ListViewComponent } from "./ListView/list-view/list-view.component";
export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    title: "This is a homepage",
  },
  {
    path: "list",
    component: ListViewComponent,
    title: "Restaurant List",
  },
];
