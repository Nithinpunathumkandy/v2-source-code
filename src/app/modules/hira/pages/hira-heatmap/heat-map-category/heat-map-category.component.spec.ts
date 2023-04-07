import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapCategoryComponent } from './heat-map-category.component';

describe('HeatMapCategoryComponent', () => {
  let component: HeatMapCategoryComponent;
  let fixture: ComponentFixture<HeatMapCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeatMapCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
