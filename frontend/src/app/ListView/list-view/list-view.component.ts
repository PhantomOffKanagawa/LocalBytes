import { Component, OnInit,inject } from "@angular/core";
import Restaurant from "../restaurant.model";
import { NgFor, NgIf } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DetailsComponent } from "../details/details.component";

@Component({
  selector: "app-list-view",
  imports: [NgFor, NgIf, MatCardModule, MatDividerModule],
  templateUrl: "./list-view.component.html",
  styleUrl: "./list-view.component.css",
})
export class ListViewComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  openDialog(restaurant: Restaurant): void {
    const dialogRef = this.dialog.open(DetailsComponent, {
      width: "1000px",
      data: { restaurant },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }


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

export class DialogData {

}
