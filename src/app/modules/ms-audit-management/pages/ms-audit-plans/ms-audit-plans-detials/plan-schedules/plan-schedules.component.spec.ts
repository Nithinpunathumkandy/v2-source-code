import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSchedulesComponent } from './plan-schedules.component';

describe('PlanSchedulesComponent', () => {
  let component: PlanSchedulesComponent;
  let fixture: ComponentFixture<PlanSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanSchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
