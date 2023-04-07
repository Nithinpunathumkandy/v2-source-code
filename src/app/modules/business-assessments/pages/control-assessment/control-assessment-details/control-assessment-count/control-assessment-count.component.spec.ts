import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentCountComponent } from './control-assessment-count.component';

describe('ControlAssessmentCountComponent', () => {
  let component: ControlAssessmentCountComponent;
  let fixture: ComponentFixture<ControlAssessmentCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
