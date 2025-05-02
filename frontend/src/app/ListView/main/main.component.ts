import { Component, OnInit } from "@angular/core";
import Restaurant from "../restaurant.model";
import { NgFor } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
@Component({
  selector: "app-main",
  imports: [NgFor, MatCardModule],
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
        description: `This is test + ${i}`,
        rating: 5.0,
        comments: [`This is test + ${i}`],
      };
      this.restaurants.push(rest);
    }
  }
}
