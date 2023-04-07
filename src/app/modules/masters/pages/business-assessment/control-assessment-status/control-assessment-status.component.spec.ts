import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentStatusComponent } from './control-assessment-status.component';

describe('ControlAssessmentStatusComponent', () => {
  let component: ControlAssessmentStatusComponent;
  let fixture: ComponentFixture<ControlAssessmentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
