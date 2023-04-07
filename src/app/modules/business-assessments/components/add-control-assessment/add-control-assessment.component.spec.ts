import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddControlAssessmentComponent } from './add-control-assessment.component';

describe('AddControlAssessmentComponent', () => {
  let component: AddControlAssessmentComponent;
  let fixture: ComponentFixture<AddControlAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddControlAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddControlAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
