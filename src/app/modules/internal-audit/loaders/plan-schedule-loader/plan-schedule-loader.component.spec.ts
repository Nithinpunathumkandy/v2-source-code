import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanScheduleLoaderComponent } from './plan-schedule-loader.component';

describe('PlanScheduleLoaderComponent', () => {
  let component: PlanScheduleLoaderComponent;
  let fixture: ComponentFixture<PlanScheduleLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanScheduleLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanScheduleLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
