import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraAssessmentComponent } from './hira-assessment.component';

describe('HiraAssessmentComponent', () => {
  let component: HiraAssessmentComponent;
  let fixture: ComponentFixture<HiraAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
