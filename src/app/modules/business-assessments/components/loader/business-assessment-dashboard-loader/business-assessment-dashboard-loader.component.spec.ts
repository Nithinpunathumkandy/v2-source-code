import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAssessmentDashboardLoaderComponent } from './business-assessment-dashboard-loader.component';

describe('BusinessAssessmentDashboardLoaderComponent', () => {
  let component: BusinessAssessmentDashboardLoaderComponent;
  let fixture: ComponentFixture<BusinessAssessmentDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessAssessmentDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAssessmentDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
