import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentDetailsComponent } from './control-assessment-details.component';

describe('ControlAssessmentDetailsComponent', () => {
  let component: ControlAssessmentDetailsComponent;
  let fixture: ComponentFixture<ControlAssessmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
