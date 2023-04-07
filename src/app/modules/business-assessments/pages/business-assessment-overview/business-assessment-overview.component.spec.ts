import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAssessmentOverviewComponent } from './business-assessment-overview.component';

describe('BusinessAssessmentOverviewComponent', () => {
  let component: BusinessAssessmentOverviewComponent;
  let fixture: ComponentFixture<BusinessAssessmentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessAssessmentOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAssessmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
