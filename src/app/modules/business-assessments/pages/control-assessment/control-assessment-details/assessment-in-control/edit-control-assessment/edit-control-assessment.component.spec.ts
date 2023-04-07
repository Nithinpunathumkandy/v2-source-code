import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditControlAssessmentComponent } from './edit-control-assessment.component';

describe('EditControlAssessmentComponent', () => {
  let component: EditControlAssessmentComponent;
  let fixture: ComponentFixture<EditControlAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditControlAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditControlAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
