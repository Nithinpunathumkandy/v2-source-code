import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAssessmentStatusComponent } from './business-assessment-status.component';

describe('BusinessAssessmentStatusComponent', () => {
  let component: BusinessAssessmentStatusComponent;
  let fixture: ComponentFixture<BusinessAssessmentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessAssessmentStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAssessmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
