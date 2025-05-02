import { Component, OnInit } from "@angular/core";
import Restaurant from "../restaurant.model";
import { NgFor, NgIf } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
@Component({
  selector: "app-main",
  imports: [NgFor, NgIf, MatCardModule, MatDividerModule],
  templateUrl: "./main.component.html",
  styleUrl: "./main.component.css",
})
export class MainComponent implements OnInit {
  restaurants: Restaurant[] = [];
  ngOnInit(): void {
    for (let i = 0; i < 10; i++) {
      let rest: Restaurant = {
        id: i,
        title: `This is test + ${i}`,
        description: `This is description test + ${i}`,
        rating: 4.5,
        comments: [`Comment + ${i}`],
      };
      this.restaurants.push(rest);
    }
  }
}
