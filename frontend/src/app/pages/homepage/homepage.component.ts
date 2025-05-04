import { Component } from '@angular/core';
import { HomeComponent } from '../../components/home/home.component';

@Component({
  selector: 'app-homepage',
  imports: [HomeComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {}
