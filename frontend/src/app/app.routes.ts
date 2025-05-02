import { Routes } from "@angular/router";
import { HomepageComponent } from "./Homepage/homepage/homepage.component";
import { ListViewComponent } from "./ListView/list-view/list-view.component";
export const routes: Routes = [
  {
    path: "",
    component: HomepageComponent,
    title: "This is a homepage",
  },
  {
    path: "list",
    component: ListViewComponent,
    title: "Restaurant List",
  },
];
