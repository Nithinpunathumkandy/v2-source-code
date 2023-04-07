import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentComponent } from './control-assessment.component';

describe('ControlAssessmentComponent', () => {
  let component: ControlAssessmentComponent;
  let fixture: ComponentFixture<ControlAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
