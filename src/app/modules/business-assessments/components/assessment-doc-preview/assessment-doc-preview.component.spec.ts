import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDocPreviewComponent } from './assessment-doc-preview.component';

describe('AssessmentDocPreviewComponent', () => {
  let component: AssessmentDocPreviewComponent;
  let fixture: ComponentFixture<AssessmentDocPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentDocPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDocPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
