import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentDashboardComponent } from './control-assessment-dashboard.component';

describe('ControlAssessmentDashboardComponent', () => {
  let component: ControlAssessmentDashboardComponent;
  let fixture: ComponentFixture<ControlAssessmentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
