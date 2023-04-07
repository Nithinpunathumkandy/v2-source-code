import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentInControlComponent } from './assessment-in-control.component';

describe('AssessmentInControlComponent', () => {
  let component: AssessmentInControlComponent;
  let fixture: ComponentFixture<AssessmentInControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentInControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentInControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
