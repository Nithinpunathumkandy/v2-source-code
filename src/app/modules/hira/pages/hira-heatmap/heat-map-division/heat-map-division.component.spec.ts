import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapDivisionComponent } from './heat-map-division.component';

describe('HeatMapDivisionComponent', () => {
  let component: HeatMapDivisionComponent;
  let fixture: ComponentFixture<HeatMapDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeatMapDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
