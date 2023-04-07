import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssessmentListComponent } from './risk-assessment-list.component';

describe('RiskAssessmentListComponent', () => {
  let component: RiskAssessmentListComponent;
  let fixture: ComponentFixture<RiskAssessmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAssessmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
