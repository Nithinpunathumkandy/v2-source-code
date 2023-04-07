import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDocumentComponent } from './assessment-document.component';

describe('AssessmentDocumentComponent', () => {
  let component: AssessmentDocumentComponent;
  let fixture: ComponentFixture<AssessmentDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
