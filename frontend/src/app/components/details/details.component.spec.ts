import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:frontend/src/app/components/map/map.component.spec.ts
import { MapViewComponent } from './map.component';

describe('MapViewComponent', () => {
  let component: MapViewComponent;
  let fixture: ComponentFixture<MapViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapViewComponent);
========
import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
>>>>>>>> origin/Tom:frontend/src/app/ListView/details/details.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
