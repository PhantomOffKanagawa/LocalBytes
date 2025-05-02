import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HomeComponent } from "./Homepage/homepage/home/home.component";
import { HeaderComponent } from "./Homepage/homepage/header/header.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, HomeComponent, HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "frontend";
}
