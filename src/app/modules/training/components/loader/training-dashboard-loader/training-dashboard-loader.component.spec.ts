import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDashboardLoaderComponent } from './training-dashboard-loader.component';

describe('TrainingDashboardLoaderComponent', () => {
  let component: TrainingDashboardLoaderComponent;
  let fixture: ComponentFixture<TrainingDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
