import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapDeptComponent } from './heat-map-dept.component';

describe('HeatMapDeptComponent', () => {
  let component: HeatMapDeptComponent;
  let fixture: ComponentFixture<HeatMapDeptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeatMapDeptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
